import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Orders } from './entities/order.entity';
import { Products } from '../products/entities/products.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const user: Users | null = await this.usersRepository.findOneBy({
        id: createOrderDto.userId,
      });
      if (!user)
        throw new NotFoundException('User was not found on the database');

      const order = new Orders();
      order.date = new Date();
      order.user = user;

      const newOrder = await this.ordersRepository.save(order);

      let total = 0;

      const productsArray: Products[] = await Promise.all(
        createOrderDto.products.map(async (element) => {
          const product: Products | null =
            await this.productsRepository.findOneBy({
              id: element?.id,
            });

          if (!product) throw new NotFoundException();

          if (product.stock <= 0) {
            throw new BadRequestException(
              `Product ${product.name} has no stock available`,
            );
          }

          total += Number(product.price);

          await this.productsRepository.update(
            { id: product.id },
            { stock: product.stock - 1 },
          );

          return product;
        }),
      );

      const orderDetail = new OrderDetails();
      orderDetail.price = Number(total.toFixed(2));
      orderDetail.products = productsArray;
      orderDetail.order = newOrder;

      await this.orderDetailsRepository.save(orderDetail);

      return await this.ordersRepository.find({
        where: { id: newOrder.id },
        relations: { orderDetails: true },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Unexpected error while creating order',
      );
    }
  }

  async cancelOrder(orderId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: {
        orderDetails: {
          products: true,
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.CANCELED)
      throw new BadRequestException('Order already canceled');

    const detail = order.orderDetails;

    for (const product of detail.products) {
      product.stock += 1;
      await this.productsRepository.save(product);
    }

    order.status = OrderStatus.CANCELED;
    await this.ordersRepository.save(order);

    return {
      id: order.id,
      status: order.status,
    };
  }

  async findAllOrders() {
    const orders = await this.ordersRepository.find({
      relations: {
        user: true,
        orderDetails: {
          products: true,
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      date: order.date,
      status: order.status,
      user: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        address: order.user.address,
        country: order.user.country,
      },
      orderDetails: {
        price: order.orderDetails.price,
        products: order.orderDetails.products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
        })),
      },
    }));
  }

  async getOrderById(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        orderDetails: {
          products: true,
        },
      },
      select: {
        id: true,
        date: true,
        status: true,
        user: {
          id: true,
          name: true,
          email: true,
          address: true,
          phone: true,
          country: true,
          city: true,
        },
        orderDetails: {
          id: true,
          price: true,
          products: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
