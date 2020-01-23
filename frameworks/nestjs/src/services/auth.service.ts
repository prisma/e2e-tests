import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { SignupInput } from '../resolvers/auth/dto/signup.input';
import { PhotonService } from './photon.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly photon: PhotonService,
    private readonly passwordService: PasswordService
  ) {}

  async createUser(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    const user = await this.photon.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        role: 'USER'
      }
    });

    return this.jwtService.sign({ userId: user.id });
  }

  async login(email: string, password: string): Promise<string> {
    let user: User;

    user = await this.photon.user.findOne({ where: { email } });

    if (user === null) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.jwtService.sign({ userId: user.id });
  }

  validateUser(userId: string): Promise<User> {
    return this.photon.user.findOne({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.photon.user.findOne({ where: { id } });
  }
}
