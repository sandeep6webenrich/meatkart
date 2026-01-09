import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasourceUrl: process.env.DIRECT_URL });

async function main() {
  console.log('Start seeding ...');

  // Create Categories
  const categories = [
    {
      name: 'Mutton',
      slug: 'mutton',
      imageUrl: '/images/mutton.png',
      displayOrder: 1,
      products: [
        {
          name: 'Mutton Curry Cut',
          slug: 'mutton-curry-cut',
          description: 'Mutton Curry Cut are pieces of lamb shoulder which is commonly used to make stew and is great when barbecued, stuffed & in curries.',
          freshnessNotes: 'Lamb meat is high in protein, selenium, zinc and iron. The speciality of this meat is that it has all 8 amino acids.',
          cutTypes: 'Curry Cut',
          stockQuantity: 50,
          productImages: {
            create: [
              { imageUrl: '/images/free-shipping-mutton.png', isPrimary: true },
            ]
          },
          productWeights: {
            create: [
              { weight: '500grms', price: 380 },
              { weight: '1kg', price: 750 },
            ]
          }
        },
        {
          name: 'Mutton Cubes',
          slug: 'mutton-cubes',
          description: 'Premium mutton cubes for special dishes.',
          cutTypes: 'Cubes',
          stockQuantity: 30,
          productImages: {
            create: [
              { imageUrl: '/images/mutton-cubes.jpg', isPrimary: true },
            ]
          },
          productWeights: {
            create: [
              { weight: '500grms', price: 450 },
            ]
          }
        },
        {
            name: 'Mutton Keema (Minced)',
            slug: 'mutton-keema',
            description: 'Finely minced mutton.',
            cutTypes: 'Minced',
            stockQuantity: 40,
            productImages: {
              create: [
                { imageUrl: '/images/halal.png', isPrimary: true },
              ]
            },
            productWeights: {
              create: [
                { weight: '250grms', price: 200 },
                { weight: '500grms', price: 380 },
              ]
            }
        },
         {
          name: 'Special Lamb Mutton Boneless Halal Cut',
          slug: 'special-lamb-mutton-boneless',
          description: 'Boneless mutton pieces.',
          cutTypes: 'Boneless',
          stockQuantity: 25,
          productImages: {
            create: [
              { imageUrl: '/images/sell-3.png', isPrimary: true },
            ]
          },
          productWeights: {
            create: [
              { weight: '500grms', price: 550 },
            ]
          }
        }
      ]
    },
    {
      name: 'Chicken',
      slug: 'chicken',
      imageUrl: '/images/chicken-or.png',
      displayOrder: 2,
      products: [
        {
          name: 'Fresh Curry Cut Chicken',
          slug: 'fresh-curry-cut-chicken',
          description: 'Fresh tender chicken curry cut pieces.',
          cutTypes: 'Curry Cut',
          stockQuantity: 100,
          productImages: {
            create: [
              { imageUrl: '/images/sell-2.png', isPrimary: true },
            ]
          },
          productWeights: {
            create: [
              { weight: '500grms', price: 120 },
              { weight: '1kg', price: 220 },
            ]
          }
        },
        {
          name: 'Chicken Drumsticks',
          slug: 'chicken-drumsticks',
          description: 'Juicy chicken drumsticks.',
          cutTypes: 'Drumsticks',
          stockQuantity: 80,
          productImages: {
            create: [
              { imageUrl: '/images/chicken-or.png', isPrimary: true },
            ]
          },
          productWeights: {
            create: [
              { weight: '450grms', price: 180 },
            ]
          }
        },
        {
            name: 'Pre-Spiced Frozen Chicken Cutlets',
            slug: 'chicken-cutlets',
            description: 'Ready to cook frozen chicken cutlets.',
            cutTypes: 'Cutlets',
            stockQuantity: 60,
            productImages: {
              create: [
                { imageUrl: '/images/sell-1.png', isPrimary: true },
              ]
            },
            productWeights: {
              create: [
                { weight: '1pack', price: 150 },
              ]
            }
          }
      ]
    },
    {
        name: 'Seafood',
        slug: 'seafood',
        imageUrl: '/images/sell-4.png',
        displayOrder: 3,
        products: [
            {
                name: 'Pre-Spiced Andhra Tawa Fish Party Pack',
                slug: 'andhra-tawa-fish',
                description: 'Spicy Andhra style fish party pack.',
                cutTypes: 'Fillet',
                stockQuantity: 20,
                productImages: {
                  create: [
                    { imageUrl: '/images/sell-4.png', isPrimary: true },
                  ]
                },
                productWeights: {
                  create: [
                    { weight: '1pack', price: 450 },
                  ]
                }
            }
        ]
    }
  ];

  for (const cat of categories) {
    const { products, ...catData } = cat;
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: catData,
    });

    console.log(`Created category: ${category.name}`);

    for (const prod of products) {
        const product = await prisma.product.create({
            data: {
                ...prod,
                categoryId: category.id,
            }
        });
        console.log(`Created product: ${product.name}`);
    }
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
