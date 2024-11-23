import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-github2'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23liIvfnaG6XjQKlBl',
      clientSecret: 'ce0280387645fea6e4b6101e096a06e84681f5b6',
      callbackURL: 'http://localhost:3000/callback',
      scope: ['public_profile'],
    })
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile
  }
}
