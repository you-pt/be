import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './utils/userInfo.decorator';
import { Role } from './types/userRole.type';
import { Roles } from 'auth/roles.decorator';
import { RolesGuard } from 'auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

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
    console.log(user);
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
