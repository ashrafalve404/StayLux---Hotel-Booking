import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsNumber()
  pricePerNight: number;

  @IsNumber()
  rating: number;

  images?: string[];

  @IsString()
  amenities?: string;

  @IsString()
  policies?: string;

  ownerId: number;
}
