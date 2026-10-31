import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string = 'alice@example.com', name: string = 'Alice Johnson') {
    const payload = {
      sub: 1,
      email,
      name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }
}
