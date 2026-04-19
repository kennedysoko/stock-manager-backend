import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(private prisma: PrismaService) {}

  async processCheckout(checkoutDto: CheckoutDto) {
    const { cart, discount = 0, customer = 'Walk-in Customer', user = 'System' } = checkoutDto;

    return this.prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const saleItemsData: { productId: string; qty: number; price: number; }[] = [];

      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        if (product.stock < item.qty) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}`,
          );
        }

        const cost = product.price * item.qty;
        subtotal += cost;

        // Deduct stock
        const newStock = product.stock - item.qty;
        await tx.product.update({
          where: { id: product.id },
          data: { stock: newStock },
        });

        // Create transaction audit
        await tx.transaction.create({
          data: {
            type: 'OUT',
            productId: product.id,
            qty: item.qty,
            stockBefore: product.stock,
            stockAfter: newStock,
            notes: `POS Sale`, // Would include Sale Ref if pre-generated
            user,
          },
        });

        saleItemsData.push({
          productId: product.id,
          qty: item.qty,
          price: product.price,
        });
      }

      const total = subtotal - discount;

      // Create Sale
      const sale = await tx.sale.create({
        data: {
          customerName: customer,
          subtotal,
          discount,
          total,
          user,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Update notes with the actual sale ID for transactions if we wanted to
      // But it's fine for now

      return {
        ref: sale.id,
        date: sale.date,
        customer: sale.customerName,
        items: sale.items.map((si) => ({
          id: si.productId,
          name: si.product.name,
          price: si.price,
          qty: si.qty,
        })),
        subtotal: sale.subtotal,
        discount: sale.discount,
        total: sale.total,
      };
    });
  }
}
