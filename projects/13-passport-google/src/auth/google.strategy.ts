import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { type Profile, Strategy } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: '',
      clientSecret: '',
      callbackURL: 'http://localhost:3000/callback/google',
      scope: ['email', 'profile'],
    })
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { name, emails, photos } = profile
    const user = {
      accessToken,
      email: emails[0].value,
      picture: photos[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    }
    return user
  }
}
