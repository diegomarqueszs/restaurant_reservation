import {
  IsArray,
  IsDateString,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;

  @IsNumberString()
  tables: string;

  @IsNumberString()
  value: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  description: string;
}
