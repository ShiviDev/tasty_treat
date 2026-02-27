import { IsNotEmpty } from 'class-validator';

export class OrderItemDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  price: string;
  @IsNotEmpty()
  cartQty: number;
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  qty: string;
}
