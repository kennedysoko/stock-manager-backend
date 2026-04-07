import { Controller, Get, Post, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('transactions')
  findAll() {
    return this.inventoryService.findAllTransactions();
  }

  @Post('transaction')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.inventoryService.processTransaction(createTransactionDto);
  }
}
