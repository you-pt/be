import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './utils/userInfo.decorator';
import { Role } from './types/userRole.type';
import { Roles } from 'auth/roles.decorator';
import { RolesGuard } from 'auth/roles.guard';
import { log } from 'console';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("사용자 API")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "회원가입"})
  @ApiBody({schema:{
    properties:{
      email:{ type: "email", example: "asdf@gmail.com"},
      password:{ type: "string", example: "12345678"},
      passwordConfirm:{ type: "string", example: "12345678"},
      nickname: {type: "string", example: "이렐리아"},
      role: {type: "string", example: 'user'},
      name: {type: "string", example: '이름이'},
      gender: {type: "string", example: 'male'},
      phone: {type: "string", example: '011-1010-1010'},
      birth: {type: "string", example: '1999-01-11'},
    }
  }})
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @ApiOperation({ summary: "로그인"})
  @ApiBody({schema:{
    properties:{
      email:{ type: "email", example: "asdf@gmail.com"},
      password:{ type: "string", example: "12345678"}
    }
  }})
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const jwt = await this.userService.login(loginDto);
    res.cookie('Authorization', jwt.access_token, {
        httpOnly: true,
        maxAge: 12 * 60 * 60 * 1000
    })
    return {message: "로그인 성공!"};
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getEmail(@UserInfo() user: User) {
    log('API "INFO"')
    return { email: user.email, name: user.nickname };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UserInfo() user: User
  ) {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @UserInfo() user: User) {
    return this.userService.deleteUser(id, user);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll(@Query('role') role: Role, @Query('page') page: number, @Query('perPage') perPage: number) {
    return this.userService.findAll(role, page | 1, perPage | 10);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('trainer')
  findTrainer(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.userService.findTrainer(page | 1, perPage| 10)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
