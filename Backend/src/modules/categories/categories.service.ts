import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import data from '../../data.json';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}
  async seeder() {
    const categoriesNames: Set<string> = new Set(
      data.map((product) => product.category),
    );
    const categoriesArray = Array.from(categoriesNames);
    const categories = categoriesArray.map((string) => ({
      name: string,
    }));

    await this.categoriesRepository.upsert(categories, ['name']);
    return 'categories added';
  }

  async create(categoryDTO: CreateCategoryDto) {
    const categoryExist = await this.categoriesRepository.findOne({
      where: { name: categoryDTO.name },
    });

    if (categoryExist) throw new BadRequestException('Category already exists');

    const category = this.categoriesRepository.create(categoryDTO);
    await this.categoriesRepository.save(category);

    return category;
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOneById(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: string, categoryDTO: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Category not found');

    await this.categoriesRepository.update(id, categoryDTO);

    return { message: 'Category updated' };
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Category not found');

    await this.categoriesRepository.delete(id);

    return { message: 'Category removed' };
  }
}
