import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // 1. Cleanup existing data
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productWeight.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 2. Define Categories
  const categories = [
    { name: 'Chicken', slug: 'chicken', image: '/images/chicken.png' },
    { name: 'Mutton', slug: 'mutton', image: '/images/mutton.png' },
    { name: 'Seafood', slug: 'seafood', image: '/images/seafood.png' },
    { name: 'Ready to Cook', slug: 'ready-to-cook', image: '/images/sell-1.png' },
    { name: 'Eggs', slug: 'eggs', image: '/images/offerfood.png' },
    { name: 'Cold Cuts', slug: 'cold-cuts', image: '/images/sell-2.png' },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.image,
      },
    });
    createdCategories[cat.slug] = created.id;
    console.log(`Created category: ${cat.name}`);
  }

  // 3. Define Products
  const products = [
    // --- CHICKEN ---
    {
      categorySlug: 'chicken',
      name: 'Chicken Curry Cut (Small Pieces)',
      slug: 'chicken-curry-cut-small',
      description: 'Bone-in | Small cuts | Skinless. Perfect for curries.',
      imageUrl: '/images/chicken.png',
      weights: [
        { weight: '500gms', price: 169, discountPrice: 149 },
        { weight: '1kg', price: 329, discountPrice: 289 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Breast (Boneless)',
      slug: 'chicken-breast-boneless',
      description: 'Tender, boneless fillets of chicken breast. High protein.',
      imageUrl: '/images/boneless-chick.png',
      weights: [
        { weight: '450gms', price: 285, discountPrice: 249 },
        { weight: '900gms', price: 550, discountPrice: 489 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Thigh (Boneless)',
      slug: 'chicken-thigh-boneless',
      description: 'Juicy and flavorful boneless chicken thighs. Perfect for grills.',
      imageUrl: '/images/chicken.png',
      weights: [
        { weight: '450gms', price: 310, discountPrice: 279 },
        { weight: '900gms', price: 600, discountPrice: 539 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Drumsticks',
      slug: 'chicken-drumsticks',
      description: 'Juicy bone-in drumsticks. Ideal for tandoori or frying.',
      imageUrl: '/images/chicken-or.png',
      weights: [
        { weight: '500gms', price: 239, discountPrice: 199 },
        { weight: '1kg', price: 450, discountPrice: 389 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Lollipop',
      slug: 'chicken-lollipop',
      description: 'Frenched chicken winglets. The ultimate appetizer.',
      imageUrl: '/images/sell-1.png',
      weights: [
        { weight: '10 Pcs', price: 219, discountPrice: 189 },
        { weight: '20 Pcs', price: 410, discountPrice: 359 },
      ],
    },
    {
      categorySlug: 'chicken',
      name: 'Chicken Keema (Mince)',
      slug: 'chicken-keema',
      description: 'Finely minced chicken breast. Great for patties and keema curry.',
      imageUrl: '/images/boneless-chick.png',
      weights: [
        { weight: '450gms', price: 299, discountPrice: 269 },
        { weight: '900gms', price: 580, discountPrice: 520 },
      ],
    },

    // --- MUTTON ---
    {
      categorySlug: 'mutton',
      name: 'Mutton Curry Cut (Rich)',
      slug: 'mutton-curry-cut',
      description: 'Mix of bone-in and boneless pieces from shoulder and leg.',
      imageUrl: '/images/mutton.png',
      weights: [
        { weight: '500gms', price: 590, discountPrice: 549 },
        { weight: '1kg', price: 1150, discountPrice: 1049 },
      ],
    },
    {
      categorySlug: 'mutton',
      name: 'Mutton Boneless',
      slug: 'mutton-boneless',
      description: 'Tender boneless cubes. Ideal for pan-frying or slow cooking.',
      imageUrl: '/images/boneless-mutton.png',
      weights: [
        { weight: '500gms', price: 690, discountPrice: 649 },
        { weight: '1kg', price: 1350, discountPrice: 1249 },
      ],
    },
    {
      categorySlug: 'mutton',
      name: 'Mutton Keema (Minced)',
      slug: 'mutton-keema',
      description: 'Finely minced goat meat. Perfect for keema pav.',
      imageUrl: '/images/mutton-list-img.png',
      weights: [
        { weight: '450gms', price: 650, discountPrice: 599 },
        { weight: '900gms', price: 1250, discountPrice: 1150 },
      ],
    },
    {
      categorySlug: 'mutton',
      name: 'Lamb Chops',
      slug: 'lamb-chops',
      description: 'Premium chops for grilling or roasting.',
      imageUrl: '/images/mutton.png',
      weights: [
        { weight: '500gms', price: 750, discountPrice: 699 },
        { weight: '1kg', price: 1450, discountPrice: 1350 },
      ],
    },

    // --- SEAFOOD ---
    {
      categorySlug: 'seafood',
      name: 'Rohu Fish (Bengali Cut)',
      slug: 'rohu-fish-cut',
      description: 'Fresh freshwater fish, cut into round pieces with head.',
      imageUrl: '/images/fish.png',
      weights: [
        { weight: '500gms', price: 249, discountPrice: 219 },
        { weight: '1kg', price: 480, discountPrice: 420 },
      ],
    },
    {
      categorySlug: 'seafood',
      name: 'Seer Fish / Vanjaram (Steaks)',
      slug: 'seer-fish-steaks',
      description: 'Premium seawater fish steaks. Firm texture, single bone.',
      imageUrl: '/images/seafood.png',
      weights: [
        { weight: '500gms', price: 890, discountPrice: 799 },
        { weight: '1kg', price: 1750, discountPrice: 1550 },
      ],
    },
    {
      categorySlug: 'seafood',
      name: 'Prawns (Medium - Cleaned)',
      slug: 'prawns-medium',
      description: 'De-shelled and deveined prawns. Ready to cook.',
      imageUrl: '/images/seafood.png',
      weights: [
        { weight: '250gms', price: 350, discountPrice: 299 },
        { weight: '500gms', price: 650, discountPrice: 599 },
        { weight: '1kg', price: 1200, discountPrice: 1099 },
      ],
    },
    {
      categorySlug: 'seafood',
      name: 'Pomfret Fish (Whole)',
      slug: 'pomfret-whole',
      description: 'Fresh white pomfret, cleaned and ready for frying or grilling.',
      imageUrl: '/images/seafood.png',
      weights: [
        { weight: '1 Pc (300-400g)', price: 450, discountPrice: 399 },
        { weight: '2 Pcs (600-800g)', price: 850, discountPrice: 750 },
      ],
    },

    // --- READY TO COOK ---
    {
      categorySlug: 'ready-to-cook',
      name: 'Chicken Cutlets',
      slug: 'chicken-cutlets',
      description: 'Spiced minced chicken patties. Fry and serve.',
      imageUrl: '/images/sell-1.png',
      weights: [
        { weight: '4 Pcs', price: 169, discountPrice: 149 },
        { weight: '8 Pcs', price: 320, discountPrice: 279 },
      ],
    },
    {
      categorySlug: 'ready-to-cook',
      name: 'Peri Peri Chicken Wings',
      slug: 'peri-peri-wings',
      description: 'Spicy marinated wings. Ready to grill or fry.',
      imageUrl: '/images/sell-2.png',
      weights: [
        { weight: '10 Pcs', price: 249, discountPrice: 219 },
        { weight: '20 Pcs', price: 480, discountPrice: 420 },
      ],
    },
    {
      categorySlug: 'ready-to-cook',
      name: 'Mutton Seekh Kebab',
      slug: 'mutton-seekh-kebab',
      description: 'Traditional spiced mutton mince skewers. Grill and eat.',
      imageUrl: '/images/sell-1.png',
      weights: [
        { weight: '4 Pcs', price: 350, discountPrice: 299 },
        { weight: '8 Pcs', price: 680, discountPrice: 580 },
      ],
    },

    // --- EGGS ---
    {
      categorySlug: 'eggs',
      name: 'Classic White Eggs',
      slug: 'classic-eggs',
      description: 'Farm fresh white eggs. Antibiotic residue free.',
      imageUrl: '/images/offerfood.png',
      weights: [
        { weight: '6 Eggs', price: 55, discountPrice: 49 },
        { weight: '12 Eggs', price: 105, discountPrice: 95 },
        { weight: '30 Eggs', price: 250, discountPrice: 220 },
      ],
    },
    {
      categorySlug: 'eggs',
      name: 'Brown Eggs (Free Range)',
      slug: 'brown-eggs',
      description: 'Nutritious brown eggs from free-range hens.',
      imageUrl: '/images/offerfood.png',
      weights: [
        { weight: '6 Eggs', price: 85, discountPrice: 75 },
        { weight: '12 Eggs', price: 160, discountPrice: 140 },
      ],
    },
  ];

  for (const prod of products) {
    const categoryId = createdCategories[prod.categorySlug];
    if (!categoryId) {
      console.warn(`Category not found for ${prod.name}`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        cutTypes: 'Standard',
        isActive: true,
        stockQuantity: 50,
        productImages: {
          create: [
            { imageUrl: prod.imageUrl, isPrimary: true },
          ],
        },
        productWeights: {
          create: prod.weights.map((w) => ({
            weight: w.weight,
            price: w.price,
            discountPrice: w.discountPrice,
            isActive: true,
            // stock: 50, // Removed as it is not in the schema
          })),
        },
      },
    });
    console.log(`Created product: ${prod.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
