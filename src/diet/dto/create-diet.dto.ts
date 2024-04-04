export interface menuType {
  name: string,
  kcal: number
}

export class CreateDietDto {
  menus: menuType[];
}
