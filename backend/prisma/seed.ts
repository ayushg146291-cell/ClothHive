import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: 'Men', slug: 'men', description: 'Men\'s Collection' },
  { name: 'Women', slug: 'women', description: 'Women\'s Collection' },
  { name: 'Accessories', slug: 'accessories', description: 'Bags, Hats, & More' },
  { name: 'Outerwear', slug: 'outerwear', description: 'Jackets & Coats' },
];

const CLOTHING_TYPES = ['T-Shirt', 'Hoodie', 'Jacket', 'Jeans', 'Sneakers', 'Sweater', 'Dress', 'Joggers'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Navy', 'Olive', 'Crimson', 'Beige', 'Charcoal', 'Indigo'];

const HIGH_QUALITY_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing data (optional, but good for fresh seeds)
  // Be careful if this is running in production! We will skip deleting users/orders.
  console.log('Clearing old products and categories...');
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  console.log('Creating categories...');
  const createdCategories = await Promise.all(
    CATEGORIES.map(cat => 
      prisma.category.create({ data: cat })
    )
  );

  // 3. Create 100 Products
  const NUM_PRODUCTS = 100;
  console.log(`Creating ${NUM_PRODUCTS} products with variants...`);

  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const category = faker.helpers.arrayElement(createdCategories);
    const type = faker.helpers.arrayElement(CLOTHING_TYPES);
    const adjective = faker.commerce.productAdjective();
    const material = faker.commerce.productMaterial();
    const name = `${adjective} ${material} ${type}`;
    
    // Random price between $20 and $200
    const price = faker.number.float({ min: 20, max: 200, fractionDigits: 2 });
    // 30% chance to have a discount
    const comparePrice = Math.random() > 0.7 ? +(price * faker.number.float({ min: 1.2, max: 1.5 })).toFixed(2) : null;
    
    // Select 1-3 random images
    const numImages = faker.number.int({ min: 1, max: 3 });
    const images = faker.helpers.arrayElements(HIGH_QUALITY_IMAGES, numImages);

    // Pick 2-4 random sizes and colors for this specific product
    const productSizes = faker.helpers.arrayElements(SIZES, faker.number.int({ min: 2, max: SIZES.length }));
    const productColors = faker.helpers.arrayElements(COLORS, faker.number.int({ min: 1, max: 3 }));

    const product = await prisma.product.create({
      data: {
        name,
        slug: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.alphanumeric(4),
        description: faker.commerce.productDescription(),
        price,
        comparePrice,
        sku: faker.string.alphanumeric(10).toUpperCase(),
        stock: faker.number.int({ min: 10, max: 500 }),
        images,
        categoryId: category.id,
        tags: [type.toLowerCase(), material.toLowerCase(), adjective.toLowerCase()],
        isActive: true,
        isFeatured: Math.random() > 0.8, // 20% chance to be featured
        weight: faker.number.float({ min: 0.2, max: 2, fractionDigits: 1 }),
      }
    });

    // Create Variants (Cartesian product of Sizes x Colors)
    const variantsData = [];
    for (const size of productSizes) {
      for (const color of productColors) {
        variantsData.push({
          productId: product.id,
          size,
          color,
          stock: faker.number.int({ min: 0, max: 50 }),
          price: null, // Uses parent price
          sku: `${product.sku}-${size}-${color.substring(0, 3).toUpperCase()}`
        });
      }
    }

    await prisma.productVariant.createMany({
      data: variantsData
    });
  }

  console.log(`✅ Successfully seeded ${NUM_PRODUCTS} products and categories!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
