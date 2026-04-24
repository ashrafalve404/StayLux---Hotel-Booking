import { IsNotEmpty, IsNumber, IsString, IsOptional, IsNumberString } from 'class-validator';

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

  @IsOptional()
  pricePerNight: number;

  @IsOptional()
  rating?: number;

  @IsOptional()
  reviewCount?: number;

  @IsOptional()
  images: string[];

  @IsOptional()
  amenities?: string;

  @IsOptional()
  policies?: string;

  @IsOptional()
  ownerId: number;
}