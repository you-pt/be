import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Role } from '../types/userRole.type';
import { Gender } from '../types/gender.type';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Length(8)
  password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Length(8)
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;

  // @IsString()
  // @IsNotEmpty({ message: '이름을 입력해주세요.' })
  // name: string;

  @IsEnum(Gender)
  @IsNotEmpty({ message: '성별을 입력해주세요.' })
  gender: Gender;

  // @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  // @Matches(/^\d{3}-\d{3,4}-\d{4}$/)
  // phone: string;

  // @IsNotEmpty({ message: '생년월일을 입력해주세요.' })
  // @Matches(/^\d{4}-\d{1,2}-\d{1,2}$/)
  // birth: string;

  @IsEnum(Role)
  role: Role;
}
