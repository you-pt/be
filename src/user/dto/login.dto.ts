import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty({ message: '이메일을 입력해주세요.' })
    email: string;
  
    @IsString()
    @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
    @Length(8)
    password: string;
}
