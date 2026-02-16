import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  auth0Id: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
