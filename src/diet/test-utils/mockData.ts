interface Meal {
  mealId: number;
  userId: number;
  reportAI: string | null;
  report: string | null;
  createdAt: string;
}

interface Menu {
  menuId: number;
  mealId: number;
  name: string;
  kcal: number;
}

interface MenuType {
  name: string;
  kcal: number;
}

interface MenuDTO {
  menus: MenuType[];
}

export const generateMeal = (cycles: number): Meal[] => {
  let result = [];
  for (let i = 1; i <= cycles; i++) {
    result = [
      ...result,
      {
        mealId: i,
        userId: 1,
        reportAI: null,
        report: null,
        createdAt: '2012-05-17 10:20:30',
      },
    ];
  }
  return result;
};

export const generateMenuDTO = (cycles: number = 1): MenuDTO => {
  let result = [];
  for (let i = 1; i <= cycles; i++) {
    result = [
      ...result,
      {
        name: `메뉴 ${i}`,
        kcal: `${i}000`,
      },
    ];
    return { menus: result };
  }
};

export const generateMenu = (cycles: number = 1): Menu[] => {
  let result = [];
  for (let i = 1; i <= cycles; i++) {
    result = [
      ...result,
      {
        menuId: i,
        mealId: 1,
        name: `메뉴 ${i}`,
        kcal: `${i}000`,
      },
    ];
  }
  return result;
};
