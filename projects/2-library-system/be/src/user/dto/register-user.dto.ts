import { IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty({ message: 'username is required' })
  username: string

  @IsNotEmpty({ message: 'password is required' })
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string
}
