import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany();
  }

  findLowStock() {
    return this.prisma.product.findMany({
      where: {
        stock: {
          lte: this.prisma.product.fields.minStockLevel,
        },
      },
    });
  }

  async create(createProductDto: CreateProductDto) {
    const { cat, min, stock, ...rest } = createProductDto;
    
    // Start a transaction if stock > 0, to auto-create 'IN' transaction
    if (stock > 0) {
      return this.prisma.$transaction(async (tx) => {
        const product = await tx.product.create({
          data: {
            category: cat,
            minStockLevel: min,
            stock,
            ...rest,
          },
        });

        await tx.transaction.create({
          data: {
            productId: product.id,
            type: 'IN',
            qty: stock,
            stockBefore: 0,
            stockAfter: stock,
            user: 'System',
            notes: 'Initial stock',
          },
        });

        return product;
      });
    }

    return this.prisma.product.create({
      data: {
        category: cat,
        minStockLevel: min,
        stock,
        ...rest,
      },
    });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { cat, min, ...rest } = updateProductDto;
    return this.prisma.product.update({
      where: { id },
      data: {
        category: cat,
        minStockLevel: min,
        ...rest,
      },
    });
  }
}
