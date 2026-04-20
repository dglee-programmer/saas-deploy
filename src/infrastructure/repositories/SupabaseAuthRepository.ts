import { IAuthRepository, AuthResponse } from '@/core/application/interfaces/IAuthRepository';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseAuthRepository implements IAuthRepository {
  constructor(private supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      error: error ? { message: error.message } : null,
    };
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    return {
      user: data.user,
      error: error ? { message: error.message } : null,
    };
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }
}
