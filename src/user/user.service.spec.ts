import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender } from './types/gender.type';
import { Role } from './types/userRole.type';
import * as bcrypt from 'bcrypt';
import { TrainerInfo } from '../entities/trainerInfo.entity';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let jwtServiceMock: Partial<JwtService>

  const createUserDto = {
    email: 'user123',
    password: '12345!@fd',
    passwordConfirm: '12345!@fd',
    nickname: 'kimName',
    name: '김이름',
    gender: Gender.Male,
    phone: '010-0000-0000',
    birth: '2000-02-15',
    role: Role.User,
  };

  const updateUserDto = {
    password: '12345!@fd',
    name: '김이름아님',
    nickname: 'kimNoName',
    phone: '010-0001-0001',
  };

  const loginDto = {
    email: 'user123',
    password: '12345!@fd'
  }

  beforeEach(async () => {
    userRepositoryMock = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn().mockReturnValue('test_jwt_token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);


  });
  describe('유저 회원가입', () => {
    it('유저 회원가입 성공', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(undefined);
      await userService.findByEmail(createUserDto.email);
      await userService.findByNickname(createUserDto.nickname);
      userService.findByEmail(createUserDto.email)
      await userService.register(createUserDto);
      expect(userRepositoryMock.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
          password: expect.any(String),
          passwordConfirm: createUserDto.passwordConfirm,
          nickname: createUserDto.nickname,
          name: createUserDto.name,
          gender: createUserDto.gender,
          phone: createUserDto.phone,
          birth: createUserDto.birth,
          role: createUserDto.role,
        }),

      );
      const { password, passwordConfirm, ...user } = createUserDto;
      userRepositoryMock.save.mockResolvedValue(user);
      expect(await userService.register(createUserDto)).toEqual(undefined);
    });

    it('유저 회원가입 - email 또는 nickname 중복', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(new User()) //new User()
      await expect(userService.register(createUserDto)).rejects.toThrow(new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다!'));

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined)
      jest.spyOn(userService, 'findByNickname').mockResolvedValue(new User())
      await expect(userService.register(createUserDto)).rejects.toThrow(new ConflictException('중복된 닉네임입니다!'));
    });
  });
  describe('로그인', () => {
    it('로그인 성공', async () => {
      userRepositoryMock.findOne.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10), // 실제 해시 함수를 사용해 테스트
      });
      const result = await userService.login(loginDto);
      expect(result).toHaveProperty('access_token', 'test_jwt_token');
    });

    it('로그인 - 사용자가 없음', async () => {
      userRepositoryMock.findOne.mockResolvedValue(undefined); // 가정: 사용자가 없음
      await expect(userService.login(loginDto)).rejects.toThrow(new UnauthorizedException('이메일을 확인해주세요.'));
    });

    it('로그인 - 비밀번호 틀림', async () => {
      userRepositoryMock.findOne.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        password: await bcrypt.hash('other password', 10), // 실제 해시 함수를 사용해 테스트
      });
      await expect(userService.login(loginDto)).rejects.toThrow(new UnauthorizedException('비밀번호를 확인해주세요.'));
    });
  });
  describe('유저 전체 조회', () => {
    it('유저 전체 조회', async () => {
      const page = 1;
      const perPage = 10;
      const mockUser = [{ email: 'user1@naver.com', nickname: 'user1', role: 'trainer' },
      { email: 'user2@naver.com', nickname: 'user2', role: 'user' },
      { email: 'user3@naver.com', nickname: 'user3', role: 'admin' }
      ];
      userRepositoryMock.find.mockResolvedValue(mockUser);
      expect(await userService.findAll(undefined, page, perPage)).toEqual(mockUser);
      expect(userRepositoryMock.find).toHaveBeenCalledWith({
        select: { email: true, nickname: true, role: true },
        take: +perPage,
        skip: (page - 1) * perPage,
      });
    });

    it('role별 유저 전체 조회', async () => {
      const role = Role.Trainer
      const page = 1;
      const perPage = 10;
      const mockUser = [{ email: 'user1@naver.com', nickname: 'user1', role: 'trainer' },
      { email: 'user2@naver.com', nickname: 'user2', role: 'trainer' },
      { email: 'user3@naver.com', nickname: 'user3', role: 'trainer' }
      ];
      userRepositoryMock.find.mockResolvedValue(mockUser);
      expect(await userService.findAll(role, page, perPage)).toEqual(mockUser);
      expect(userRepositoryMock.find).toHaveBeenCalledWith({
        where: { role },
        select: { email: true, nickname: true, role: true },
        take: +perPage,
        skip: (page - 1) * perPage,
      });
    });
  });


  it('유저 상세 조회', async () => {
    const id = 1;
    const mockUser = {
      email: 'user1@naver.com',
      name: '김유저',
      nickname: 'user1',
      gender: 'male',
      phone: '010-0000-0000',
      birth: '2000-02-15',
      role: 'trainer',

    };
    userRepositoryMock.findOne.mockResolvedValue(mockUser);
    expect(await userService.findOne(id)).toEqual(mockUser);
    expect(userRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id },
      select: { email: true, name: true, nickname: true, gender: true, phone: true, birth: true, role: true },
    });
  });

  it('Trainer 조회', async () => {
    const page = 1;
    const perPage = 10;
    const mockUser = [{ email: 'user1@naver.com', nickname: 'user1', role: 'trainer' },
    { email: 'user2@naver.com', nickname: 'user2', role: 'trainer' },
    { email: 'user3@naver.com', nickname: 'user3', role: 'trainer' }
    ];
    userRepositoryMock.find.mockResolvedValue(mockUser);
    expect(await userService.findTrainer(page, perPage)).toEqual(mockUser);
    expect(userRepositoryMock.find).toHaveBeenCalledWith({
      where: { role: Role.Trainer },
      select: { email: true, nickname: true, role: true },
      take: +perPage,
      skip: (page - 1) * perPage,
    });
  });

  describe('유저 정보 업데이트', () => {
    it('유저 정보 업데이트 성공', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };

      const updateUser = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash('12345!@fd', 10),
        name: '김이름아님',
        nickname: 'kimNoName',
        phone: '010-0001-0001',
        gender: Gender.Male,
        birth: '2000-02-15',
        role: Role.User,
      }
      userRepositoryMock.findOne.mockResolvedValue(myUser);
      userRepositoryMock.update.mockResolvedValue(updateUser)
      userRepositoryMock.findOneBy.mockResolvedValue(updateUser)
      expect(await userService.updateUser(myUser.id, updateUserDto, myUser)).toEqual(updateUser)
    });

    it('유저 정보 업데이트 - 비밀번호 업데이트', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };

      const updateUser = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash('123456!@fd', 10),
        name: '김이름아님',
        nickname: 'kimNoName',
        phone: '010-0001-0001',
        gender: Gender.Male,
        birth: '2000-02-15',
        role: Role.User,
      }
      userRepositoryMock.findOne.mockResolvedValue(myUser);
      userRepositoryMock.update.mockResolvedValue(updateUser)
      userRepositoryMock.findOneBy.mockResolvedValue(updateUser)
      expect(await userService.updateUser(myUser.id, { ...updateUserDto, changePassword: '123456!@fd' }, myUser)).toEqual(updateUser)
    });

    it('유저 정보 업데이트 - 유저 정보 없음', async () => {
      userRepositoryMock.findOne.mockResolvedValue(undefined);
      await expect(userService.updateUser(1, updateUserDto, new User())).rejects.toThrow(new NotFoundException('사용자를 찾을 수 없습니다.'));
    });

    it('유저 정보 업데이트 - 로그인 id와 요청 id 다름', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };
      userRepositoryMock.findOne.mockResolvedValue(new User());
      await expect(userService.updateUser(2, updateUserDto, myUser)).rejects.toThrow(new UnauthorizedException('본인의 계정만 접근 가능합니다.'));
    });

    it('유저 정보 업데이트 - 비밀번호 불일치', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };
      userRepositoryMock.findOne.mockResolvedValue({ id: 1, password: await bcrypt.hash('other password', 10) });
      await expect(userService.updateUser(1, updateUserDto, myUser)).rejects.toThrow(new UnauthorizedException('비밀번호가 일치하지 않습니다.'));
    });
  });

  describe('유저 삭제', () => {
    it('유저 삭제 성공', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };
      userRepositoryMock.findOneBy.mockResolvedValue(new User());
      userRepositoryMock.delete.mockResolvedValue(myUser);
      expect(await userService.deleteUser(1, myUser)).toEqual({ message: '삭제 완료!' });
    });

    it('유저 삭제 - 유저 정보 없음', async () => {
      userRepositoryMock.findOneBy.mockResolvedValue(undefined);
      await expect(userService.deleteUser(1, new User())).rejects.toThrow(new NotFoundException('사용자를 찾을 수 없습니다.'));
    });

    it('유저 삭제 - 로그인 id와 요청 id 다름', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        password: await bcrypt.hash(updateUserDto.password, 10),
        nickname: 'kimName',
        name: '김이름',
        gender: Gender.Male,
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      };
      userRepositoryMock.findOneBy.mockResolvedValue(new User());
      await expect(userService.deleteUser(2, myUser)).rejects.toThrow(new UnauthorizedException('본인의 계정만 접근 가능합니다.'));
    });
  });


});
