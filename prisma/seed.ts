import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@united.com' },
    update: {
      passwordHash, // Update password if exists
      role: 'admin',
    },
    create: {
      email: 'admin@united.com',
      name: 'Admin User',
      passwordHash,
      role: 'admin',
      phone: '1234567890',
    },
  })
  
  console.log('Admin user seeded:', admin.email)

  // Categories
  const immunity = await prisma.category.upsert({
    where: { slug: 'immunity-boosters' },
    update: {},
    create: {
      name: 'Immunity Boosters',
      slug: 'immunity-boosters',
      description: 'Strengthen your body’s natural defense system.',
      sortOrder: 1,
    },
  })

  const digestion = await prisma.category.upsert({
    where: { slug: 'digestion-gut-health' },
    update: {},
    create: {
      name: 'Digestion & Gut Health',
      slug: 'digestion-gut-health',
      description: 'Support healthy digestion and gut balance.',
      sortOrder: 2,
    },
  })

  const stress = await prisma.category.upsert({
    where: { slug: 'stress-relief' },
    update: {},
    create: {
      name: 'Stress Relief',
      slug: 'stress-relief',
      description: 'Calm your mind and improve sleep quality.',
      sortOrder: 3,
    },
  })

  const haircare = await prisma.category.upsert({
    where: { slug: 'hair-care' },
    update: {},
    create: {
      name: 'Hair Care',
      slug: 'hair-care',
      description: 'Natural solutions for strong and healthy hair.',
      sortOrder: 4,
    },
  })

  const skincare = await prisma.category.upsert({
    where: { slug: 'skin-care' },
    update: {},
    create: {
      name: 'Skin Care',
      slug: 'skin-care',
      description: 'Radiant glow with ayurvedic herbs.',
      sortOrder: 5,
    },
  })

  // Products

  // 1. Ashwagandha (Existing)
  const ashwagandha = await prisma.product.upsert({
    where: { slug: 'organic-ashwagandha-root-powder' },
    update: {},
    create: {
      name: 'Organic Ashwagandha Root Powder',
      slug: 'organic-ashwagandha-root-powder',
      description: 'Premium quality Ashwagandha powder to reduce stress and improve energy levels.',
      ingredients: '100% Organic Ashwagandha Root',
      benefits: 'Reduces stress, improves energy, boosts immunity',
      price: 399.00,
      discountedPrice: 299.00,
      stockQuantity: 100,
      categoryId: stress.id,
      images: {
        create: [
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=jar%20of%20ashwagandha%20powder%20with%20herbal%20leaves%20on%20wooden%20table%20natural%20lighting%20product%20photography&image_size=square_hd',
            altText: 'Ashwagandha Powder Jar',
            isPrimary: true,
            sortOrder: 0,
          }
        ]
      }
    },
  })

  // 2. Tulsi Drops (Existing)
  const tulsi = await prisma.product.upsert({
    where: { slug: 'pure-tulsi-drops' },
    update: {},
    create: {
      name: 'Pure Tulsi Drops',
      slug: 'pure-tulsi-drops',
      description: 'Concentrated extract of 5 types of Tulsi for powerful immunity support.',
      ingredients: 'Extract of Rama, Krishna, Vana, Kapoor, and Shukla Tulsi',
      benefits: 'Boosts immunity, fights cough & cold, detoxifies body',
      price: 249.00,
      discountedPrice: 199.00,
      stockQuantity: 150,
      categoryId: immunity.id,
      images: {
        create: [
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=small%20bottle%20of%20tulsi%20drops%20with%20fresh%20basil%20leaves%20green%20background%20wellness%20theme&image_size=square_hd',
            altText: 'Tulsi Drops Bottle',
            isPrimary: true,
            sortOrder: 0,
          }
        ]
      }
    },
  })

  // 3. Triphala (Existing)
  const triphala = await prisma.product.upsert({
    where: { slug: 'triphala-digestive-tablets' },
    update: {},
    create: {
      name: 'Triphala Digestive Tablets',
      slug: 'triphala-digestive-tablets',
      description: 'Traditional ayurvedic formulation for gentle digestive cleansing.',
      ingredients: 'Amla, Bibhitaki, Haritaki',
      benefits: 'Relieves constipation, improves digestion, antioxidant rich',
      price: 199.00,
      stockQuantity: 200,
      categoryId: digestion.id,
      images: {
        create: [
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=bottle%20of%20triphala%20tablets%20surrounded%20by%20amla%20fruits%20ayurvedic%20setting&image_size=square_hd',
            altText: 'Triphala Tablets Bottle',
            isPrimary: true,
            sortOrder: 0,
          }
        ]
      }
    },
  })

  // 4. Premium Chyawanprash (New - Multi Image + Video)
  const chyawanprash = await prisma.product.upsert({
    where: { slug: 'premium-chyawanprash' },
    update: {},
    create: {
      name: 'Premium Chyawanprash',
      slug: 'premium-chyawanprash',
      description: 'Ancient ayurvedic superfood for immunity and longevity. Enriched with 40+ herbs.',
      ingredients: 'Amla, Ghee, Honey, Ashwagandha, Guduchi, etc.',
      benefits: 'Boosts immunity, improves digestion, anti-aging',
      price: 599.00,
      discountedPrice: 499.00,
      stockQuantity: 50,
      categoryId: immunity.id,
      images: {
        create: [
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=jar%20of%20chyawanprash%20with%20spoon%20and%20amla%20rustic%20background%20high%20quality&image_size=square_hd',
            altText: 'Chyawanprash Jar',
            isPrimary: true,
            sortOrder: 0,
          },
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=spoonful%20of%20chyawanprash%20texture%20detail%20macro%20shot&image_size=square_hd',
            altText: 'Texture Detail',
            isPrimary: false,
            sortOrder: 1,
          }
        ]
      },
      videos: {
        create: [
          {
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
            title: 'Product Overview',
            sortOrder: 0,
          }
        ]
      }
    },
  })

  // 5. Bhringraj Hair Oil (New - Haircare)
  const bhringraj = await prisma.product.upsert({
    where: { slug: 'bhringraj-hair-oil' },
    update: {},
    create: {
      name: 'Bhringraj Hair Oil',
      slug: 'bhringraj-hair-oil',
      description: 'Intensive hair treatment for hair fall and premature graying.',
      ingredients: 'Bhringraj, Coconut Oil, Amla, Sesame Oil',
      benefits: 'Reduces hair fall, promotes growth, prevents graying',
      price: 349.00,
      stockQuantity: 80,
      categoryId: haircare.id,
      images: {
        create: [
          {
            imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=bottle%20of%20dark%20herbal%20hair%20oil%20with%20bhringraj%20flowers%20ayurveda&image_size=portrait_4_3',
            altText: 'Bhringraj Oil Bottle',
            isPrimary: true,
            sortOrder: 0,
          }
        ]
      }
    },
  })

    // 6. Kumkumadi Tailam (New - Skincare)
    const kumkumadi = await prisma.product.upsert({
      where: { slug: 'kumkumadi-tailam' },
      update: {},
      create: {
        name: 'Kumkumadi Tailam',
        slug: 'kumkumadi-tailam',
        description: 'Miraculous beauty fluid for skin brightening and anti-aging.',
        ingredients: 'Saffron, Sandalwood, Lotus Pollen',
        benefits: 'Brightens skin, reduces dark circles, anti-aging',
        price: 899.00,
        discountedPrice: 799.00,
        stockQuantity: 30,
        categoryId: skincare.id,
        images: {
          create: [
            {
              imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxurious%20bottle%20of%20saffron%20oil%20kumkumadi%20with%20crocus%20flowers%20golden%20glow&image_size=square_hd',
              altText: 'Kumkumadi Tailam Bottle',
              isPrimary: true,
              sortOrder: 0,
            },
            {
              imageUrl: 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=drop%20of%20golden%20oil%20on%20skin%20macro%20beauty%20shot&image_size=square_hd',
              altText: 'Application',
              isPrimary: false,
              sortOrder: 1,
            }
          ]
        }
      },
    })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
