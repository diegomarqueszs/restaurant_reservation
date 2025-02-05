import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

interface User {
  userId: number;
  email: string;
  password: string;
}

const users: User[] = [];
  

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signUp(email: string, password: string) {
    const existingUser = users.find(user => user.email === email);
    if(existingUser){
      return new BadRequestException('Email já existe!');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(password, salt, 32) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = {
      userId: 1,
      email,
      password: saltAndHash,
    }
    users.push(user);
    const { password: _, ...result } = user;

    return result;
  }


  async signIn(email: string, password: string) {
    const user = users.find(user => user.email === email);
    if(!user){
      return new UnauthorizedException('Login Inválido!');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if(storedHash != hash.toString('hex')){
      return new UnauthorizedException('Senha Inválida!');
    }

    const payload = { username: user.email, sub: user.userId};
    return { accessToken: this.jwtService.sign(payload)};
  }
}