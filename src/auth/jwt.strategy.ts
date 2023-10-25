import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository";
import { User } from '../user/entities/user.entity'
import * as config from 'config'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }
  async validator(payload) {
    const { username } = payload
    const user: User = await this.userRepository.findOne(username)

    if (!user) {
      throw new UnauthorizedException()
    }

    return user
  }
}



