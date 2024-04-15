import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Gender } from './types/gender.type';
import { Role } from './types/userRole.type';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TrainerInfo } from '../entities/trainerInfo.entity';

const mockUserService = {
  register: jest.fn(),
  login: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findAll: jest.fn(),
  findTrainer: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.cookie = jest.fn().mockReturnValue(res);
  return res as Response
}



interface IUser {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  name: string;
  gender: Gender;
  phone: string;
  birth: string;
  role: Role;
}

const createUserDto: IUser = {
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

const loginDto = {
  email: 'user123',
  password: '12345!@fd',
}

const updateUserDto = {
  password: '123456!@fd',
  name: '김이름아님',
  nickname: 'kimNoName',
  phone: '010-0000-1111',
}

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let res: Partial<Response>;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        ConfigService,
        User,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
      ],
    }).compile();

    res = mockResponse();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('register', () => {
    it('회원가입 성공', async () => {
      const result = {
        id: 1,
        email: 'user123',
        password: '12345!@fd',
        nickname: 'kimName',
        gender: 'male',
        phone: '010-0000-0000',
        birth: '2000-02-15',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest.spyOn(mockUserService, 'register').mockImplementationOnce(() => result);
      expect(await userController.register(createUserDto)).toEqual(result);
      expect(mockUserService.register).toHaveBeenCalledTimes(1);
      expect(mockUserService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('로그인 성공', async () => {
      const res = mockResponse();
      const result = { 'access_token': 'test_jwt_token' };
      jest.spyOn(mockUserService, 'login').mockImplementationOnce(() => result);
      expect(await userController.login(loginDto, res)).toEqual({ message: '로그인 성공!' });
    })
  })

  describe('info', () => {
    it('유저 정보 조회', async () => {
      const myUser: User = {
        id: 1,
        email: 'user123',
        nickname: 'KimName',
        password: '',
        name: '',
        gender: Gender.Male,
        phone: '',
        birth: '',
        role: Role.User,
        createdAt: undefined,
        updatedAt: undefined,
        meals: [],
        messages: [],
        schedules: [],
        trainerInfo: new TrainerInfo
      }
      expect(userController.getInfo(myUser)).toEqual({ email: myUser.email, name: myUser.nickname });
    })
  })

  describe('userUpdate', () => {
    it('유저 정보 업데이트', async () => {
      const myUpdateUser = {
        ...updateUserDto,
        id: 1,
        email: 'user123',
        password: '',
        gender: Gender.Male,
        birth: '',
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest.spyOn(mockUserService, 'updateUser').mockImplementationOnce(() => myUpdateUser);
      expect(await userController.update(myUpdateUser.id, myUpdateUser, new User())).toEqual(myUpdateUser);
      expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(myUpdateUser.id, myUpdateUser, new User());
    })
  })

  describe('userDelete', () => {
    it('유저 삭제', async () => {
      const result = { message: '삭제 완료!' };
      jest.spyOn(mockUserService, 'deleteUser').mockImplementationOnce(() => result);
      expect(await userController.remove(1, new User())).toEqual(result);
      expect(mockUserService.deleteUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1, new User());
    });
  });

  describe('findAll', () => {
    it('유저 전체 조회', async () => {
      const result = [
        {
          "email": "user123@naver.com",
          "nickname": "누구게",
          "role": "user"
        },
        {
          "email": "user123123@naver.com",
          "nickname": "누구게2",
          "role": "trainer"
        }
      ];
      jest.spyOn(mockUserService, 'findAll').mockImplementationOnce(() => result);
      expect(await userController.findAll(undefined, undefined, undefined)).toEqual(result);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(mockUserService.findAll).toHaveBeenCalledWith(undefined, 1, 10);
    });

    it('role = user인 유저 전체 조회', async () => {
      const result = [
        {
          "email": "user123@naver.com",
          "nickname": "누구게",
          "role": "user"
        },
        {
          "email": "user123123@naver.com",
          "nickname": "누구게2",
          "role": "user"
        }
      ];
      jest.spyOn(mockUserService, 'findAll').mockImplementationOnce(() => result);
      expect(await userController.findAll(Role.User, 1, 10)).toEqual(result);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(mockUserService.findAll).toHaveBeenCalledWith(Role.User, 1, 10);
    });
  });

  describe('findTrainer', () => {
    it('Trainer 전체 조회', async () => {
      const result = [
        {
          "email": "user123@naver.com",
          "nickname": "누구게",
          "role": "trainer"
        },
        {
          "email": "user123123@naver.com",
          "nickname": "누구게2",
          "role": "trainer"
        }
      ];
      jest.spyOn(mockUserService, 'findTrainer').mockImplementationOnce(() => result);
      expect(await userController.findTrainer(1, 10)).toEqual(result);
      expect(mockUserService.findTrainer).toHaveBeenCalledTimes(1);
      expect(mockUserService.findTrainer).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('유저 상세 조회', async () => {
      const result = {
        "id": 1,
        "email": "user123123@naver.com",
        "name": '누구게',
        "nickname": "누구게",
        "gender": "male",
        "phone": "010-0000-0000",
        "birth": "2000-02-15",
        "role": "trainer"
      }

      jest.spyOn(mockUserService, 'findOne').mockImplementationOnce(() => result);
      expect(await userController.findOne(1)).toEqual(result);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
