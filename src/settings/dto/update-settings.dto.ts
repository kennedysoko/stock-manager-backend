import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, string>;
}
