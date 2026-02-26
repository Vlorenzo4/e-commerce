import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import data from '../../data.json';
import { Products } from './entities/products.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from '../categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateProductsDto } from './dto/create-product.dto';
import { UpdateProductsDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
  ) {}
  async seeder() {
    const categories: Categories[] = await this.categoriesRepository.find();
    if (!categories.length) {
      throw new BadRequestException(
        'Categories must be created before loading products',
      );
    }
    const newProducts: Products[] = data.map((product) => {
      const category: Categories | undefined = categories.find(
        (category) => product.category === category.name,
      );
      const newProduct = new Products();
      newProduct.name = product.name;
      newProduct.description = product.description;
      newProduct.price = product.price;
      newProduct.imgUrl = product.imgUrl;
      newProduct.stock = product.stock;
      newProduct.category = category!;

      return newProduct;
    });

    await this.productsRepository.upsert(newProducts, ['name']);
    return 'products added';
  }

  async createProduct(productDTO: CreateProductsDto) {
    const existingProduct = await this.productsRepository.findOneBy({
      name: productDTO.name,
    });

    if (existingProduct) {
      throw new BadRequestException('Product already exists');
    }

    const category = await this.categoriesRepository.findOneBy({
      id: productDTO.categoryId,
    });

    if (!category) throw new NotFoundException('Category not found');

    const product = this.productsRepository.create({
      name: productDTO.name,
      description: productDTO.description,
      price: productDTO.price,
      imgUrl: productDTO.imgUrl,
      stock: productDTO.stock,
      category,
    });

    await this.productsRepository.save(product);

    return product;
  }

  async findAllProducts() {
    return await this.productsRepository.find({
      relations: {
        category: true,
      },
    });
  }

  async updateProduct(id: string, productDTO: UpdateProductsDto) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product not found');

    await this.productsRepository.update(id, productDTO);

    const updateProduct = await this.productsRepository.findOneBy({ id });

    if (!updateProduct) throw new NotFoundException();

    return {
      id: updateProduct.id,
      name: updateProduct.name,
      description: updateProduct.description,
      price: updateProduct.price,
      stock: updateProduct.stock,
    };
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product not found');

    await this.productsRepository.delete(id);

    return { message: 'Product removed' };
  }
}
