import { Test, TestingModule } from '@nestjs/testing';
import { DietService } from './diet.service';
import { DataSource, Repository } from 'typeorm';
import { Meal } from '../entities/meals.entity';
import { Menu } from '../entities/menus.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateMeal, generateMenu, generateMenuDTO } from './test-utils/mockData';
import { User } from '../entities/user.entity';

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
          provide: getRepositoryToken(User),
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
    console.log(DietService);
  });

  test('::::: 식단 생성 :::::', async () => {
    const mealData = generateMeal(1)[0];
    const menuData = generateMenu(2);
    const menuDTO = generateMenuDTO(2);
    service.create = jest
      .fn()
      .mockImplementation(async () => ({ meal: mealData, menu: menuData }));

    const result = await service.create(1, menuDTO);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(await service.create(1, menuDTO)).toEqual({
      meal: generateMeal(1)[0],
      menu: generateMenu(2),
    });
    expect(result['menu']).toHaveLength(2);
  });

  // test("식단 생성 - userId X", async () => {
  //   const mealData = generateMeal(1)[0];
  //   const menuData = generateMenu(2);
  //   jest.spyOn(service, "create").mockResolvedValue({ meal: mealData, menu: menuData })

  //   expect(service.create).toThrow()
  // })

  test('::::: 메뉴 조회 :::::', async () => {
    const menuData = generateMenu(2);
    service.findMenus = jest.fn().mockImplementation(async () => menuData);
    const result = await service.findMenus(1, 1);

    expect(service.findMenus).toHaveBeenCalled();
    expect(service.findMenus).toHaveBeenCalledTimes(1)
    expect(result).toEqual(menuData);
    expect(result).toHaveLength(2);
  });

});
