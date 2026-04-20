import { IAuthRepository, AuthResponse } from '../../interfaces/IAuthRepository';
import { SignInRequestDto } from '../../dtos/auth/SignInRequestDto';

export class SignInUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: SignInRequestDto): Promise<AuthResponse> {
    return this.authRepository.signIn(dto.email, dto.password);
  }
}
