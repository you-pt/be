import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { compare, hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Raw, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Role } from './types/userRole.type';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Schedule } from '../entities/schedules.entity';
import { MessageService } from 'src/message/message.service';
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @Inject(MessageService)
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    const existingNickname = await this.findByNickname(createUserDto.nickname);

    if (existingNickname) {
      throw new ConflictException('중복된 닉네임입니다!');
    }

    const hashedPassword = await hash(createUserDto.password, 10);
    await this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password', 'token'],
      where: { email: loginDto.email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    if (user.token !== loginDto.token) {
      await this.userRepository.update({ id: user.id }, { token: loginDto.token });
      const schedules = await this.scheduleRepository.find({
        where: {
          ptTime: Raw((alias) => `${alias} > NOW()`),
          userId: user.id
        },
      })
      console.log(schedules);

      for(let schedule of schedules) {
        const cronJobId = uuidv4();

        let date = schedule.ptTime;
        date.setMinutes(date.getMinutes() - 10);

        // this.schedulerRegistry.deleteCronJob(schedule.cronJobId);
        await this.messageService.addCronJob(loginDto.token, 'PT를 준비해주세요! 10분 뒤 시작합니다!',
        `날짜 : ${schedule.ptTime.toLocaleString()}`,
        date, cronJobId)
      }
      
    }




    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findAll(role: Role, page: number, perPage: number) {
    if (role !== 'trainer' && role !== 'user') {
      return await this.userRepository.find({
        select: { email: true, nickname: true, role: true },
        take: +perPage,
        skip: (page - 1) * perPage,
      });
    }

    return await this.userRepository.find({
      where: { role },
      select: { email: true, nickname: true, role: true },
      take: +perPage,
      skip: (page - 1) * perPage,
    });
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: { email: true, nickname: true, role: true, token: true },
    });
  }

  async findTrainer(page: number, perPage: number) {
    return await this.userRepository.find({
      where: { role: Role.Trainer },
      select: { email: true, nickname: true, role: true },
      take: +perPage,
      skip: (page - 1) * perPage,
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, user: User) {
    const checkUser = await this.userRepository.findOne({
      where: { id: user.id },
      select: { password: true },
    });

    if (!checkUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (id !== user.id)
      // || checkUser.role !== admin
      throw new UnauthorizedException('본인의 계정만 접근 가능합니다.');

    if (!(await compare(updateUserDto.password, checkUser.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }
    await this.userRepository.update(
      { id },
      {
        email: updateUserDto.email,
        nickname: updateUserDto.nickname,
      },
    );

    if (updateUserDto.changePassword)
      await this.userRepository.update(
        { id },
        { password: await hash(updateUserDto.changePassword, 10) },
      );

    return await this.userRepository.findOneBy({ id });
  }

  async deleteUser(id: number, user: User) {
    const checkUser = await this.userRepository.findOneBy({ id: user.id });

    if (!checkUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (id !== user.id)
      // || checkUser.role !== admin
      throw new UnauthorizedException('본인의 계정만 접근 가능합니다.');

    await this.userRepository.delete({ id });

    return { message: '삭제 완료!' };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByNickname(nickname: string) {
    return await this.userRepository.findOneBy({ nickname });
  }

  async findTrainers(){
    return await this.userRepository.find({
      where: { role: Role.Trainer },
      select: {id: true, nickname: true}
    })
  }
}
