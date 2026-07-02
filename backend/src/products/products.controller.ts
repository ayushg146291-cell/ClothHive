import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('sale') sale?: string,
  ) {
    return this.productsService.findAll({
      skip: skip ? parseInt(skip, 10) : 0,
      take: take ? parseInt(take, 10) : 20,
      search,
      categoryId,
      category,
      sort,
      sale: sale === 'true',
    });
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  // --- Reviews ---
  @Post(':id/reviews')
  @UseInterceptors(FilesInterceptor('images', 5))
  async addReview(
    @Param('id') id: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.addReview(id, user.userId, createReviewDto, files);
  }

  // --- Admin Review Endpoints ---

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/reviews')
  async getAdminReviews() {
    return this.productsService.getAdminReviews();
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('reviews/:id/approve')
  async approveReview(@Param('id') id: string) {
    return this.productsService.approveReview(id);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.productsService.deleteReview(id);
  }

  // --- Admin Endpoints ---

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
