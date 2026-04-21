import { createAdminClient } from '@/infrastructure/config/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const adminSupabase = await createAdminClient();
    
    // 1. Check & Repair Bucket
    let bucketsData = await adminSupabase.storage.listBuckets();
    let noteImagesBucket = bucketsData.data?.find(b => b.id === 'note_images');
    let repairMessage = 'NONE';

    if (!noteImagesBucket) {
      console.log('Bucket "note_images" not found. Creating...');
      const { data, error } = await adminSupabase.storage.createBucket('note_images', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760 // 10MB limit for bucket
      });
      if (error) {
        repairMessage = `FAILED: ${error.message}`;
      } else {
        repairMessage = 'SUCCESS: Bucket created as public';
        bucketsData = await adminSupabase.storage.listBuckets();
        noteImagesBucket = bucketsData.data?.find(b => b.id === 'note_images');
      }
    } else if (!noteImagesBucket.public) {
      const { error } = await adminSupabase.storage.updateBucket('note_images', {
        public: true
      });
      repairMessage = error ? `FAILED UPDATE: ${error.message}` : 'SUCCESS: Bucket updated to public';
    }
    
    const diag = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING',
      bucketsError: bucketsData.error?.message || 'NONE',
      noteImagesBucket: noteImagesBucket || 'NOT_FOUND',
      repairStatus: repairMessage,
      env: process.env.NODE_ENV
    };

    return NextResponse.json(diag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
