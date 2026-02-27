import { IsNotEmpty, IsOptional } from 'class-validator';

export default class AddressDTO {
  @IsNotEmpty()
  address1: string;
  @IsOptional()
  address2: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  fullName: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  postalCode: string;
  @IsOptional()
  state: string;
}
