import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export default function UserParser(
  token: string,
  jwtService: JwtService,
): User {
  const fetchedUser = jwtService.verify(token) as User;

  if (!fetchedUser) {
    throw new UnauthorizedException('user not parsed');
  }

  return fetchedUser;
}
