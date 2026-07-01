"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const faker_1 = require("@faker-js/faker");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
    console.log('Clearing old products and categories...');
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log('Creating categories...');
    const createdCategories = await Promise.all(CATEGORIES.map(cat => prisma.category.create({ data: cat })));
    const NUM_PRODUCTS = 75;
    console.log(`Creating ${NUM_PRODUCTS} products with variants...`);
    for (let i = 0; i < NUM_PRODUCTS; i++) {
        const category = faker_1.faker.helpers.arrayElement(createdCategories);
        const type = faker_1.faker.helpers.arrayElement(CLOTHING_TYPES);
        const adjective = faker_1.faker.commerce.productAdjective();
        const material = faker_1.faker.commerce.productMaterial();
        const name = `${adjective} ${material} ${type}`;
        const price = faker_1.faker.number.float({ min: 20, max: 200, fractionDigits: 2 });
        const comparePrice = Math.random() > 0.7 ? +(price * faker_1.faker.number.float({ min: 1.2, max: 1.5 })).toFixed(2) : null;
        const numImages = faker_1.faker.number.int({ min: 1, max: 3 });
        const images = faker_1.faker.helpers.arrayElements(HIGH_QUALITY_IMAGES, numImages);
        const productSizes = faker_1.faker.helpers.arrayElements(SIZES, faker_1.faker.number.int({ min: 2, max: SIZES.length }));
        const productColors = faker_1.faker.helpers.arrayElements(COLORS, faker_1.faker.number.int({ min: 1, max: 3 }));
        const product = await prisma.product.create({
            data: {
                name,
                slug: faker_1.faker.helpers.slugify(name).toLowerCase() + '-' + faker_1.faker.string.alphanumeric(4),
                description: faker_1.faker.commerce.productDescription(),
                price,
                comparePrice,
                sku: faker_1.faker.string.alphanumeric(10).toUpperCase(),
                stock: faker_1.faker.number.int({ min: 10, max: 500 }),
                images,
                categoryId: category.id,
                tags: [type.toLowerCase(), material.toLowerCase(), adjective.toLowerCase()],
                isActive: true,
                isFeatured: Math.random() > 0.8,
                weight: faker_1.faker.number.float({ min: 0.2, max: 2, fractionDigits: 1 }),
            }
        });
        const variantsData = [];
        for (const size of productSizes) {
            for (const color of productColors) {
                variantsData.push({
                    productId: product.id,
                    size,
                    color,
                    stock: faker_1.faker.number.int({ min: 0, max: 50 }),
                    price: null,
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
//# sourceMappingURL=seed.js.map