import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import {
  Controller,
  Get,
  Inject,
  Res,
  Session,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  jwtService: JwtService

  @Get('test-session')
  testSession(@Session() session: Record<string, any>) {
    console.log(session)
    session.count = session.count ? session.count + 1 : 1
    return session.count
  }

  @Get('test-jwt')
  testJwt(@Res({ passthrough: true }) response: Response) {
    const newToken = this.jwtService.sign({ count: 1 })
    response.setHeader('token', newToken)
    return 'hello'
  }

  @Get('auth')
  auth(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1]
        const data = this.jwtService.verify(token)
        const newToken = this.jwtService.sign({ count: data.count + 1 })
        response.setHeader('token', newToken)
        return data.count + 1
      } catch (err) {
        console.log(err)
        throw new UnauthorizedException()
      }
    } else {
      const newToken = this.jwtService.sign({ count: 1 })
      response.setHeader('token', newToken)
      return 1
    }
  }
}
