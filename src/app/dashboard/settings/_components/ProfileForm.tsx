'use client'

import React, { useActionState } from 'react';
import { updateProfileAction } from '@/app/actions/auth.actions';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export function ProfileForm({ initialName, email }: { initialName: string, email?: string }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        await updateProfileAction(formData);
        return { success: true };
      } catch (error: any) {
        return { error: error.message };
      }
    },
    null
  );

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-8 border border-outline-variant/10 shadow-2xl shadow-slate-200/50">
      <form action={formAction} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Icon name="badge" size={16} />
              성함
            </label>
            <input 
              name="full_name"
              defaultValue={initialName}
              className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary transition-all"
              placeholder="당신의 이름을 입력하세요"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
              <Icon name="mail" size={16} />
              이메일 주소
            </label>
            <input 
              defaultValue={email}
              disabled
              className="w-full bg-surface-container-low/50 border-none rounded-xl px-4 py-3 text-sm text-on-surface-variant cursor-not-allowed"
              type="email"
            />
            <p className="text-[10px] text-outline pl-1 font-medium">이메일 변경은 지원팀에 문의하세요.</p>
          </div>
        </div>

        {state?.success && (
          <div className="p-4 bg-primary/10 text-primary rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
            <Icon name="check_circle" size={16} />
            프로필 정보가 성공적으로 업데이트되었습니다.
          </div>
        )}

        {state?.error && (
          <div className="p-4 bg-error-container/30 text-error rounded-xl text-xs font-bold flex items-center gap-2 animate-in shake duration-300">
            <Icon name="error" size={16} />
            {state.error}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button
            variant="primary"
            size="md"
            className="px-8 shadow-lg shadow-primary/20"
            isLoading={isPending}
            leftIcon="save"
            type="submit"
          >
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
}
