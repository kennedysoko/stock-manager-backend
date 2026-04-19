import { Controller, Get, Post, Body, Put, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('users')
  getUsers() {
    return this.settingsService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.settingsService.createUser(createUserDto);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.settingsService.updateUser(id, updateUserDto);
  }

  @Get('config')
  getConfig() {
    return this.settingsService.getConfig();
  }

  @Put('config')
  updateConfig(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateConfig(updateSettingsDto.settings);
  }
}
