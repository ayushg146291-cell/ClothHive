import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null }, // Fetch root categories
      include: {
        children: {
          include: { children: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: { children: true, products: { take: 10 } },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return this.prisma.category.create({
      data: { ...dto, slug },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    let slug;
    if (dto.name) {
      slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data: slug ? { ...dto, slug } : dto,
      });
    } catch (e) {
      throw new NotFoundException('Category not found');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException('Category not found');
    }
  }
}
