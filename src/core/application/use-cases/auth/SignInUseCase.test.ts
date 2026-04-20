import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignInUseCase } from './SignInUseCase';
import { IAuthRepository } from '../../interfaces/IAuthRepository';

describe('SignInUseCase', () => {
  let signInUseCase: SignInUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    } as unknown as IAuthRepository;
    signInUseCase = new SignInUseCase(mockAuthRepository);
  });

  it('이메일과 비밀번호를 사용하여 로그인을 시도해야 한다', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    mockAuthRepository.signIn = vi.fn().mockResolvedValue({ user: { id: '1' }, error: null });

    await signInUseCase.execute(dto);

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith(dto.email, dto.password);
  });

  it('로그인 성공 시 사용자 정보를 반환해야 한다', async () => {
    const dto = { email: 'test@example.com', password: 'password123' };
    const mockUser = { id: '1', email: 'test@example.com' };
    mockAuthRepository.signIn = vi.fn().mockResolvedValue({ user: mockUser, error: null });

    const result = await signInUseCase.execute(dto);

    expect(result.user).toEqual(mockUser);
    expect(result.error).toBeNull();
  });

  it('로그인 실패 시 에러 정보를 반환해야 한다', async () => {
    const dto = { email: 'wrong@example.com', password: 'wrong' };
    const mockError = { message: 'Invalid credentials' };
    mockAuthRepository.signIn = vi.fn().mockResolvedValue({ user: null, error: mockError });

    const result = await signInUseCase.execute(dto);

    expect(result.user).toBeNull();
    expect(result.error).toEqual(mockError);
  });
});
