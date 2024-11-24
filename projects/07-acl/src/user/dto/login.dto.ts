import { IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @Length(1, 50)
  username: string

  @IsNotEmpty()
  @Length(6, 20)
  password: string
}
