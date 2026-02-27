import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsObject,
} from 'class-validator';
import AddressDTO from 'src/address/dtos/address.dto';
import { OrderItemDTO } from 'src/orderItems/dtos/order-items.dto';

export class OrderDTO {
  @ValidateNested()
  @Type(() => AddressDTO)
  @IsNotEmpty()
  address: AddressDTO;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(['card', 'upi', 'cod', 'netbanking'])
  @IsNotEmpty()
  paymentMethod: 'card' | 'upi' | 'cod' | 'netbanking';

  @ValidateNested()
  @Type(() => OrderItemDTO)
  @IsNotEmpty()
  orderItems: OrderItemDTO[];

  @IsObject()
  @IsNotEmpty()
  amounts: {
    subtotal: string;
    shipping: string;
    total: string;
  };
}

// {
//     "address": {
//         "fullName": "vaith",
//         "address1": "dfdf",
//         "address2": "fdfd",
//         "city": "fdfd",
//         "state": "",
//         "postalCode": "424",
//         "phone": "42424242"
//     },
//     "paymentMethod": "card",
//     "orderItems": [],
//     "amounts": {
//         "subtotal": 0,
//         "shipping": 20,
//         "total": 20
//     }
// }
