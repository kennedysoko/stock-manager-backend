import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { CheckoutModule } from './checkout/checkout.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SettingsModule } from './settings/settings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ProductsModule, InventoryModule, CheckoutModule, DashboardModule, SettingsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
