import { IAuthRepository, AuthResponse } from '../../interfaces/IAuthRepository';
import { SignUpRequestDto } from '../../dtos/auth/SignUpRequestDto';

export class SignUpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: SignUpRequestDto): Promise<AuthResponse> {
    return this.authRepository.signUp(dto.email, dto.password);
  }
}
