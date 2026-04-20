export interface AuthResponse {
  user: any | null;
  error: any | null;
}

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<AuthResponse>;
  signUp(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
}
