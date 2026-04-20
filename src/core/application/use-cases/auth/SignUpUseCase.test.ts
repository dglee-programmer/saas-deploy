import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignUpUseCase } from './SignUpUseCase';
import { IAuthRepository } from '../../interfaces/IAuthRepository';

describe('SignUpUseCase', () => {
  let signUpUseCase: SignUpUseCase;
  let mockAuthRepository: IAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    } as unknown as IAuthRepository;
    signUpUseCase = new SignUpUseCase(mockAuthRepository);
  });

  it('이메일과 비밀번호를 사용하여 계정 생성을 시도해야 한다', async () => {
    const dto = { email: 'new@example.com', password: 'password123' };
    mockAuthRepository.signUp = vi.fn().mockResolvedValue({ user: { id: '1' }, error: null });

    await signUpUseCase.execute(dto);

    expect(mockAuthRepository.signUp).toHaveBeenCalledWith(dto.email, dto.password);
  });

  it('계정 생성 성공 시 사용자 정보를 반환해야 한다', async () => {
    const dto = { email: 'new@example.com', password: 'password123' };
    const mockUser = { id: '1', email: 'new@example.com' };
    mockAuthRepository.signUp = vi.fn().mockResolvedValue({ user: mockUser, error: null });

    const result = await signUpUseCase.execute(dto);

    expect(result.user).toEqual(mockUser);
    expect(result.error).toBeNull();
  });
});
