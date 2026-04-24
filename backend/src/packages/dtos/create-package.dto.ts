import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  duration: number;

  inclusions?: string[];

  @IsNumber()
  hotelId: number;

  image?: string;
}
