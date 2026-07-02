import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    categoryId?: string;
    sort?: string;
    sale?: boolean;
  }) {
    const { skip = 0, take = 20, search, categoryId, sort, sale } = params;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (sale) {
      where.comparePrice = { not: null };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        where,
        orderBy,
        include: { 
          variants: true,
          reviews: { 
            where: { isVerified: true },
            select: { rating: true } 
          } 
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const dataWithRatings = data.map(product => {
      const actualReviewCount = product.reviews?.length || 0;
      const reviewCount = actualReviewCount > 0 ? actualReviewCount : 1;
      const avgRating = actualReviewCount > 0 
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / actualReviewCount 
        : 5;
      return { ...product, avgRating, reviewCount };
    });

    return {
      data: dataWithRatings,
      total,
      page: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isVerified: true },
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }

    // Calculate avgRating and reviewCount
    const actualReviewCount = product.reviews.length;
    const reviewCount = actualReviewCount > 0 ? actualReviewCount : 1;
    const avgRating = actualReviewCount > 0 
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / actualReviewCount 
      : 5;

    return { ...product, avgRating, reviewCount };
  }

  // --- Reviews ---
  async addReview(productId: string, userId: string, dto: CreateReviewDto, files: Express.Multer.File[]) {
    // Check if user already reviewed
    const existingReview = await this.prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Upload images if any
    const imageUrls: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const url = await this.uploadService.uploadImage(file, 'reviews');
        imageUrls.push(url);
      }
    }

    const review = await this.prisma.review.create({
      data: {
        productId,
        userId,
        rating: Number(dto.rating),
        title: dto.title,
        body: dto.body,
        images: imageUrls,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    return review;
  }

  async getAdminReviews() {
    return this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        product: { select: { name: true, slug: true, images: true } }
      }
    });
  }

  async approveReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: { isVerified: true }
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.delete({
      where: { id }
    });
  }

  // --- Admin Methods ---

  async create(dto: CreateProductDto) {
    // Generate slug from name
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    return this.prisma.product.create({
      data: {
        ...dto,
        slug,
        variants: {
          create: dto.variants || [],
        },
      },
      include: { variants: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const { variants, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Update basic info
      const updatedProduct = await tx.product.update({
        where: { id },
        data: productData,
      });

      // Simple implementation: delete old variants and create new ones if provided
      if (variants) {
        await tx.productVariant.deleteMany({ where: { productId: id } });
        await tx.productVariant.createMany({
          data: variants.map(v => ({ ...v, productId: id })),
        });
      }

      return tx.product.findUnique({
        where: { id },
        include: { variants: true },
      });
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
