import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  findAllTransactions() {
    return this.prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      include: { product: true },
    });
  }

  async processTransaction(createTransactionDto: CreateTransactionDto) {
    const { type, productId, qty, notes, user } = createTransactionDto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const stockBefore = product.stock;
      let stockAfter = stockBefore;

      if (type === 'IN') {
        stockAfter = stockBefore + qty;
      } else if (type === 'OUT') {
        if (qty > stockBefore) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${stockBefore}, Requested: ${qty}`,
          );
        }
        stockAfter = stockBefore - qty;
      } else {
        throw new BadRequestException('Invalid transaction type');
      }

      // Update product stock
      await tx.product.update({
        where: { id: productId },
        data: { stock: stockAfter },
      });

      // Create transaction record
      return tx.transaction.create({
        data: {
          type,
          productId,
          qty,
          stockBefore,
          stockAfter,
          notes,
          user: user || 'System',
        },
        include: { product: true },
      });
    });
  }
}
