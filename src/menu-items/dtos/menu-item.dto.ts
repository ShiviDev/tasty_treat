import { IsNotEmpty } from 'class-validator';

export class MenuItemDto {
  @IsNotEmpty()
  'name': string;
  @IsNotEmpty()
  'image': string;
  @IsNotEmpty()
  'price': string;
  @IsNotEmpty()
  'category': string;
  @IsNotEmpty()
  'classification': string;
  'course': string;
}
