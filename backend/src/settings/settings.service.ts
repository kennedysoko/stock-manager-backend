import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // --- Users ---
  async getAllUsers() {
    return (this.prisma as any).user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        initials: true,
        bg: true,
        status: true,
        // intentionally omitting password
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const existing = await (this.prisma as any).user.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      throw new BadRequestException('Username already taken');
    }

    const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    const bgColors = ['#E53935', '#D81B60', '#8E24AA', '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B', '#43A047', '#7CB342', '#F4511E'];
    const bg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const user = await (this.prisma as any).user.create({
      data: {
        ...data,
        initials,
        bg,
      },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    if (data.username) {
      const existing = await (this.prisma as any).user.findUnique({
        where: { username: data.username },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Username already taken');
      }
    }

    let initials;
    if (data.name) {
      initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    }

    try {
      const user = await (this.prisma as any).user.update({
        where: { id },
        data: {
          ...data,
          ...(initials ? { initials } : {}),
        },
      });
      const { password: _, ...result } = user;
      return result;
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  // --- Settings ---
  async getConfig() {
    const settingsList = await (this.prisma as any).setting.findMany();
    // Convert array of KVs to an object map
    return settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async updateConfig(settings: Record<string, string>) {
    const keys = Object.keys(settings);
    
    // Process sequentially or transactionally - doing transaction maps
    return this.prisma.$transaction(
      keys.map((key) => 
        (this.prisma as any).setting.upsert({
          where: { key },
          update: { value: settings[key] },
          create: { key, value: settings[key] },
        })
      )
    );
  }
}
