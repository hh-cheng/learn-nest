import { IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty({ message: 'validate.usernameNotEmpty' })
  username: string

  @IsNotEmpty({ message: 'validate.passwordNotEmpty' })
  @MinLength(6, { message: 'validate.passwordMinLength' })
  password: string
}
