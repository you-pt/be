import { Test, TestingModule } from '@nestjs/testing';
import { DietService } from './diet.service';
import { DataSource, Repository } from 'typeorm';
import { Meal } from '../entities/meals.entity';
import { Menu } from '../entities/menus.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateMeal, generateMenu } from './test-utils/mockData';

const mockDataSource = {
  query: jest.fn(),
  execute: jest.fn(),
  close: jest.fn(),
};

describe('DietService', () => {
  let service: DietService;
  let mealMockRepo: Repository<Meal>;
  let menuMockRepo: Repository<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DietService,
        {
          provide: getRepositoryToken(Meal),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Menu),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<DietService>(DietService);
    mealMockRepo = module.get<Repository<Meal>>(getRepositoryToken(Meal));
    menuMockRepo = module.get<Repository<Menu>>(getRepositoryToken(Menu));
  });

  test('should be defined', () => {
    expect(mealMockRepo).toBeDefined();
    expect(menuMockRepo).toBeDefined();
    expect(DietService).toBeDefined();
  });

  /**
   * 1. mockreSolvedValue 사용해서 결과 값 생성
   * 2.
   */
  test('식단 생성', async () => {
    const mealData = generateMeal(1)[0];
    const menuData = generateMenu(2);
    mealMockRepo.create = jest
      .fn()
      .mockResolvedValue({ meal: mealData, menu: menuData });
    expect(mealMockRepo.create).toHaveBeenCalledTimes(1)
    // expect(mealMockRepo.create).toEqual(
    //   {
    //     meal: generateMeal(1)[0],
    //     menu: generateMenu(2)
    //   }
    // )
  });
  // test('메뉴 조회', () => {});
  // test('식단 제거', () => {});
  // test("[오류] 식단", () => {})
});
