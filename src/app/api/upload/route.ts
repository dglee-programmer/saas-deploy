import { createClient, createAdminClient } from '@/infrastructure/config/supabase/server';
import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const FREE_TIER_QUOTA = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '업로드할 파일이 없습니다.' }, { status: 400 });
    }

    // 1. 개별 파일 용량 체크 (1MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '이미지 용량은 1MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // 2. 전체 할당량 체크 (Admin Client 사용)
    const { data: profile, error: profileError } = await adminSupabase
      .from('users')
      .select('storage_used, subscription_tier')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json({ error: '사용자 정보를 불러올 수 없습니다.' }, { status: 404 });
    }

    // 무료 사용자: 10MB 초과 체크
    if (profile.subscription_tier !== 'premium') {
      if ((profile.storage_used || 0) + file.size > FREE_TIER_QUOTA) {
        return NextResponse.json({ 
          error: '무료 티어 저장 용량(10MB)을 초과했습니다. 프리미엄으로 업그레이드하세요.' 
        }, { status: 403 });
      }
    }

    // 3. Supabase Storage: 버킷 존재 여부 확인 및 자동 생성 (Self-healing)
    const { data: buckets, error: bucketsError } = await adminSupabase.storage.listBuckets();
    if (bucketsError) {
      console.error('List buckets error:', bucketsError);
    } else {
      const bucketExists = buckets.find(b => b.id === 'note_images');
      if (!bucketExists) {
        console.log('Bucket "note_images" not found. Creating...');
        const { error: createError } = await adminSupabase.storage.createBucket('note_images', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 5242880 // 5MB limit for bucket itself
        });
        if (createError) console.error('Bucket creation error:', createError);
      }
    }

    // 4. Supabase Storage 업로드 (Admin Client 사용 - RLS 우회)
    const fileExt = file.name ? file.name.split('.').pop() : 'png';
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('note_images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload Error Details:', uploadError);
      // 구체적인 에러 메시지 반환
      return NextResponse.json({ 
        error: `스토리지 업로드 실패: ${uploadError.message || '알 수 없는 오류'}`,
        code: uploadError.name
      }, { status: 500 });
    }

    // 5. 공개 URL 생성 및 검증
    const { data: { publicUrl } } = adminSupabase.storage
      .from('note_images')
      .getPublicUrl(fileName);

    if (!publicUrl) {
      throw new Error('Public URL generation failed');
    }

    console.log(`[Upload Success] User: ${user.id}, URL: ${publicUrl}`);

    // 6. 사용자의 storage_used 업데이트 (Admin Client 사용)
    // 비동기로 처리하여 업로드 응답 속도 최적화 (성패와 상관없이 업로드 결과 반환)
    adminSupabase
      .from('users')
      .update({ storage_used: (profile.storage_used || 0) + file.size })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) console.error('Quota update background error:', error);
      });

    return NextResponse.json({ 
      url: publicUrl,
      size: file.size,
      name: file.name 
    });
  } catch (error: any) {
    console.error('API Unhandled Error:', error);
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
