import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed with customized categories and products...");

  // 1. Clean existing records for safe, idempotent seeding
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Admin User
  const hashedPassword = await bcrypt.hash("admin123456", 10);
  await prisma.user.create({
    data: {
      name: "স্টোর অ্যাডমিন",
      email: "admin@clothstore.com",
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 3. Site Settings
  const settings = [
    { key: "site_name", value: "অরণ্যা ফ্যাশন", description: "Store Name" },
    { key: "site_tagline", value: "প্রিমিয়াম পাঞ্জাবী, বোরকা কাপড় ও সালোয়ার কামিজ কালেকশন", description: "Tagline" },
    { key: "site_phone", value: "01712-345678", description: "Support Phone" },
    { key: "site_whatsapp", value: "01712-345678", description: "WhatsApp Contact" },
    { key: "site_address", value: "ধানমন্ডি, ঢাকা - ১২০৯, বাংলাদেশ", description: "Physical Address" },
    { key: "delivery_inside_dhaka", value: "80", description: "Delivery Fee Inside Dhaka" },
    { key: "delivery_outside_dhaka", value: "150", description: "Delivery Fee Outside Dhaka" },
    { key: "announcement_bn", value: "✨ সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারি | অগ্রিম কোনো টাকা ছাড়াই ঘরে বসে অর্ডার করুন!", description: "Top Bar Announcement" },
    { key: "hero_title", value: "আভিজাত্য ও ঐতিহ্যের সেরা ফ্যাশন ও ফেব্রিক্স কালেকশন", description: "Hero Title" },
    { key: "hero_subtitle", value: "প্রিমিয়াম পাঞ্জাবী, বোরকা কাপড় এবং আনস্টিচড সালোয়ার কামিজের আকর্ষণীয় সমাহার।", description: "Hero Subtitle" },
    { key: "hero_banner_image", value: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80", description: "Homepage Hero Banner Image" }
  ];

  for (const s of settings) {
    await prisma.siteSetting.create({ data: s });
  }

  // 4. Categories (১. পাঞ্জাবী, ২. বোরকা কাপড়, ৩. সালোয়ার কামিজ কাপড়)
  const catPanjabi = await prisma.category.create({
    data: {
      name: "Panjabi Collection",
      nameBn: "পাঞ্জাবী",
      slug: "panjabi",
      description: "আভিজাত্য ও ঐতিহ্যের মেলবন্ধনে প্রিমিয়াম সুতি ও সিল্ক পাঞ্জাবী কালেকশন",
      imageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
      displayOrder: 1,
    },
  });

  const catBurqaFabric = await prisma.category.create({
    data: {
      name: "Burqa & Abaya Fabrics",
      nameBn: "বোরকা কাপড়",
      slug: "burqa-fabric",
      description: "১০০% অরিজিনাল দুবাই চেরি, নিদা ও প্রিমিয়াম জর্জেট আনস্টিচড বোরকা কাপড়",
      imageUrl: "https://images.unsplash.com/photo-1585728748178-577629ad05f1?auto=format&fit=crop&w=600&q=80",
      displayOrder: 2,
    },
  });

  const catSalwarFabric = await prisma.category.create({
    data: {
      name: "Salwar Kameez Fabrics",
      nameBn: "সালোয়ার কামিজ কাপড়",
      slug: "salwar-kameez",
      description: "১০০% পিওর কটন, সিল্ক ও বুটিক আনস্টিচড থ্রি-পিস ও কামিজ ড্রেস মেটেরিয়াল কাপড়",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      displayOrder: 3,
    },
  });

  // 5. Products & Variants

  // ===== CATEGORY 1: পাঞ্জাবী =====

  // Product 1: Embroidered Cotton Panjabi
  await prisma.product.create({
    data: {
      name: "Exclusive Semi-Long Embroidered Cotton Panjabi",
      nameBn: "এক্সক্লুসিভ সেমি-লং এমব্রয়ডারি কটন পাঞ্জাবী",
      slug: "exclusive-semi-long-embroidered-cotton-panjabi",
      sku: "PJ-2026-001",
      description: "১০০% প্রিমিয়াম সুতি কাপড়ে নিখুঁত কলার ও প্লাকেটে কম্পিউটার এমব্রয়ডারি ডিজাইন। অত্যন্ত আরামদায়ক ফিটিং এবং যেকোনো উৎসব ও জুমার নামাজের জন্য উপযোগী।",
      descriptionBn: "১০০% প্রিমিয়াম সুতি কাপড়ে নিখুঁত কলার ও প্লাকেটে কম্পিউটার এমব্রয়ডারি ডিজাইন। সাথে আকর্ষণীয় মেটাল বাটন ও সাইড পকেট।",
      regularPrice: 2450,
      salePrice: 1950,
      isFeatured: true,
      hasSizeVariants: true,
      sizeSelectionRequired: true,
      availableSizes: "40, 42, 44",
      categoryId: catPanjabi.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
            altText: "Exclusive Embroidered Cotton Panjabi Front View",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=800&q=80",
            altText: "Embroidery and Collar Detail",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "PJ-2026-001-40", size: "40 (বডি ৪০, ঝুল ৪০)", color: "ডিপ নেভি ব্লু / Navy Blue", stockQuantity: 15 },
          { sku: "PJ-2026-001-42", size: "42 (বডি ৪২, ঝুল ৪২)", color: "ডিপ নেভি ব্লু / Navy Blue", stockQuantity: 20 },
          { sku: "PJ-2026-001-44", size: "44 (বডি ৪৪, ঝুল ৪৪)", color: "ডিপ নেভি ব্লু / Navy Blue", stockQuantity: 12 },
        ],
      },
    },
  });

  // Product 2: Royal Jacquard Weaving Festive Panjabi
  await prisma.product.create({
    data: {
      name: "Royal Jacquard Weaving Festive Panjabi",
      nameBn: "রয়্যাল জ্যাকার্ড উইভিং প্রিমিয়াম পাঞ্জাবী",
      slug: "royal-jacquard-weaving-festive-panjabi",
      sku: "PJ-2026-002",
      description: "আভিজাত্যপূর্ণ রয়্যাল জ্যাকার্ড উইভিং টেক্সচারড ফ্যাব্রিকে তৈরি বিশেষ উৎসব পাঞ্জাবী। কলার ও হাতায় সূক্ষ্ম হ্যান্ড টাচ কাজের ফিনিশিং।",
      descriptionBn: "আভিজাত্যপূর্ণ রয়্যাল জ্যাকার্ড উইভিং টেক্সচারড ফ্যাব্রিকে তৈরি বিশেষ উৎসব পাঞ্জাবী। বিয়ে বা ঈদের অনুষ্ঠানের জন্য সেরা পছন্দ।",
      regularPrice: 2950,
      salePrice: 2450,
      isFeatured: true,
      hasSizeVariants: true,
      sizeSelectionRequired: true,
      availableSizes: "40, 42, 44",
      categoryId: catPanjabi.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=800&q=80",
            altText: "Royal Jacquard Festive Panjabi",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
            altText: "Jacquard Texture Detail",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "PJ-2026-002-40", size: "40 (বডি ৪০, ঝুল ৪০)", color: "অফ-হোয়াইট ও গোল্ডেন / Off-White", stockQuantity: 10 },
          { sku: "PJ-2026-002-42", size: "42 (বডি ৪২, ঝুল ৪২)", color: "অফ-হোয়াইট ও গোল্ডেন / Off-White", stockQuantity: 15 },
          { sku: "PJ-2026-002-44", size: "44 (বডি ৪৪, ঝুল ৪৪)", color: "অফ-হোয়াইট ও গোল্ডেন / Off-White", stockQuantity: 8 },
        ],
      },
    },
  });

  // Product 3: Casual Soft Linen Cotton Solid Panjabi
  await prisma.product.create({
    data: {
      name: "Casual Soft Linen Cotton Solid Panjabi",
      nameBn: "ক্যাজুয়াল সফট লিনেন কটন পাঞ্জাবী",
      slug: "casual-soft-linen-cotton-solid-panjabi",
      sku: "PJ-2026-003",
      description: "অত্যন্ত আরামদায়ক পিওর সফট লিনেন কটন কাপড়। গরমে পরার জন্য সর্বোচ্চ প্রশান্তি দেবে। সাইড পকেট ও প্রিমিয়াম স্ন্যাপ বাটন সমৃদ্ধ।",
      descriptionBn: "অত্যন্ত আরামদায়ক পিওর সফট লিনেন কটন কাপড়। গরমে ক্যাজুয়াল পরিধানের জন্য অতুলনীয়।",
      regularPrice: 1850,
      salePrice: 1490,
      isFeatured: false,
      hasSizeVariants: true,
      sizeSelectionRequired: true,
      availableSizes: "38, 40, 42, 44",
      categoryId: catPanjabi.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
            altText: "Casual Soft Linen Cotton Panjabi",
            displayOrder: 1,
            isThumbnail: true,
          }
        ],
      },
      variants: {
        create: [
          { sku: "PJ-2026-003-38", size: "38 (বডি ৩৮, ঝুল ৩৮)", color: "অলিভ গ্রিন / Olive Green", stockQuantity: 10 },
          { sku: "PJ-2026-003-40", size: "40 (বডি ৪০, ঝুল ৪০)", color: "অলিভ গ্রিন / Olive Green", stockQuantity: 15 },
          { sku: "PJ-2026-003-42", size: "42 (বডি ৪২, ঝুল ৪২)", color: "অলিভ গ্রিন / Olive Green", stockQuantity: 12 },
          { sku: "PJ-2026-003-44", size: "44 (বডি ৪৪, ঝুল ৪৪)", color: "অলিভ গ্রিন / Olive Green", stockQuantity: 6 },
        ],
      },
    },
  });

  // ===== CATEGORY 2: বোরকা কাপড় (শুধু কাপড় - আনস্টিচড) =====

  // Product 4: Dubai Cherry Fabric Unstitched Burqa Cloth
  await prisma.product.create({
    data: {
      name: "Original Dubai Cherry Fabric Unstitched Burqa Cloth",
      nameBn: "অরিজিনাল দুবাই চেরি আনস্টিচড বোরকা কাপড় (৪.৫ গজ)",
      slug: "original-dubai-cherry-fabric-unstitched-burqa-cloth",
      sku: "BF-2026-001",
      description: "১০০% অরিজিনাল দুবাই চেরি ফেব্রিক বোরকা কাপড়। কুঁচকে যায় না, রোদে রং নষ্ট হয় না এবং বডি ট্র্যান্সপারেন্ট নয়। পুরো ১টি ফুল ঘের বোরকা ও কোটি তৈরির জন্য পর্যাপ্ত ৪.৫ গজ বড় বহর কাপড়। (শুধুমাত্র প্রিমিয়াম আনস্টিচড কাপড়)।",
      descriptionBn: "১০০% অরিজিনাল দুবাই চেরি ফেব্রিক বোরকা কাপড়। ৪.৫ গজ বড় বহর কাপড়। (শুধুমাত্র প্রিমিয়াম কাপড়, আনস্টিচড)।",
      regularPrice: 2200,
      salePrice: 1750,
      isFeatured: true,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড কাপড় (৪.৫ গজ বড় বহর)",
      categoryId: catBurqaFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1585728748178-577629ad05f1?auto=format&fit=crop&w=800&q=80",
            altText: "Dubai Cherry Fabric Unstitched Burqa Cloth",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
            altText: "Fabric Fall and Texture View",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "BF-2026-001-BLK", size: "আনস্টিচড (৪.৫ গজ)", color: "ডিপ জেট ব্ল্যাক / Jet Black", stockQuantity: 35 },
          { sku: "BF-2026-001-COF", size: "আনস্টিচড (৪.৫ গজ)", color: "ডার্ক কফি ব্রাউন / Coffee Brown", stockQuantity: 20 },
        ],
      },
    },
  });

  // Product 5: Korean Nida Silk Unstitched Abaya Fabric
  await prisma.product.create({
    data: {
      name: "Premium Korean Nida Silk Unstitched Abaya Fabric",
      nameBn: "প্রিমিয়াম কোরিয়ান নিদা সিল্ক আনস্টিচড আবায়া ও বোরকা কাপড় (৫ গজ)",
      slug: "premium-korean-nida-silk-unstitched-abaya-fabric",
      sku: "BF-2026-002",
      description: "সিল্কি সফট ফিনিশ এবং অত্যন্ত আরামদায়ক কোরিয়ান নিদা প্রিমিয়াম ফেব্রিক। লং কোটি আবায়া ও সাথে ম্যাচিং হিজাব তৈরির জন্য ফুল ৫ গজ বড় বহর কাপড়। (শুধুমাত্র প্রিমিয়াম কাপড়, আনস্টিচড)।",
      descriptionBn: "সিল্কি সফট ফিনিশ এবং অত্যন্ত আরামদায়ক কোরিয়ান নিদা কাপড়। ৫ গজ বহর কাপড়। (শুধুমাত্র আনস্টিচড কাপড়)।",
      regularPrice: 2600,
      salePrice: 2150,
      isFeatured: true,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড কাপড় (৫ গজ বড় বহর)",
      categoryId: catBurqaFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
            altText: "Korean Nida Silk Fabric for Abaya",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
            altText: "Nida Fabric Drape Texture",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "BF-2026-002-ROSE", size: "আনস্টিচড (৫ গজ)", color: "ডাস্টি রোজ ও ব্ল্যাক কম্বো", stockQuantity: 25 },
        ],
      },
    },
  });

  // Product 6: Heavy Georgette Embroidered Burqa Fabric Piece
  await prisma.product.create({
    data: {
      name: "Heavy Georgette Embroidered Burqa Fabric Piece",
      nameBn: "হেভি জর্জেট এমব্রয়ডারি ওয়ার্ক বোরকা কাপড় পিস",
      slug: "heavy-georgette-embroidered-burqa-fabric-piece",
      sku: "BF-2026-003",
      description: "আকর্ষণীয় বুটা ও পার এমব্রয়ডারি করা প্রিমিয়াম ফক্স জর্জেট ফেব্রিক বোরকা কাপড়। পার্টি ও বিয়ের অনুষ্ঠানের গর্জিয়াস বোরকা তৈরির কাপড় পিস। (শুধুমাত্র কাপড়, আনস্টিচড)।",
      descriptionBn: "পার্টি ও বিয়ের অনুষ্ঠানের গর্জিয়াস বোরকা তৈরির জন্য আকর্ষণীয় এমব্রয়ডারি জর্জেট কাপড়। (আনস্টিচড কাপড় পিস)।",
      regularPrice: 2800,
      salePrice: 2290,
      isFeatured: false,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড কাপড় (৪.৫ গজ)",
      categoryId: catBurqaFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
            altText: "Heavy Georgette Fabric Piece for Burqa",
            displayOrder: 1,
            isThumbnail: true,
          }
        ],
      },
      variants: {
        create: [
          { sku: "BF-2026-003-BLUE", size: "আনস্টিচড (৪.৫ গজ)", color: "রয়েল মিডনাইট ব্লু / Midnight Blue", stockQuantity: 18 },
        ],
      },
    },
  });

  // ===== CATEGORY 3: সালোয়ার কামিজ কাপড় (শুধু কাপড় - আনস্টিচড) =====

  // Product 7: Luxury Hand Embroidered Cotton Three-Piece
  await prisma.product.create({
    data: {
      name: "Luxury Hand Embroidered Pure Cotton Unstitched Three-Piece Cloth",
      nameBn: "লাক্সারি হ্যান্ড এমব্রয়ডারি পিওর কটন আনস্টিচড থ্রি-পিস কাপড়",
      slug: "luxury-hand-embroidered-cotton-unstitched-three-piece",
      sku: "SK-2026-001",
      description: "১০০% পিওর মলমল কটন কামিজ কাপড় (বুটিক হ্যান্ড এমব্রয়ডারি সহ), আরামদায়ক কটন সালোয়ার কাপড় এবং ডিজিটাল প্রিন্ট পিওর সিল্ক ওড়না কাপড়। (শুধুমাত্র প্রিমিয়াম আনস্টিচড কাপড়)।",
      descriptionBn: "১০০% পিওর মলমল কটন কামিজ কাপড়, কটন সালোয়ার ও ডিজিটাল প্রিন্ট ওড়না। (আনস্টিচড থ্রি-পিস কাপড়)।",
      regularPrice: 2850,
      salePrice: 2350,
      isFeatured: true,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড থ্রি-পিস কাপড় (কামিজ ৩ গজ, সালোয়ার ২.৫ গজ, ওড়না ৫ হাত)",
      categoryId: catSalwarFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            altText: "Luxury Hand Embroidered Cotton Unstitched Three-Piece",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
            altText: "Fabric Embroidery Detail",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "SK-2026-001-MRN", size: "আনস্টিচড সেট", color: "মেরুন ও বেইজ / Maroon & Beige", stockQuantity: 30 },
          { sku: "SK-2026-001-GRN", size: "আনস্টিচড সেট", color: "প্যাস্টেল মিন্ট গ্রিন / Mint Green", stockQuantity: 20 },
        ],
      },
    },
  });

  // Product 8: Traditional Tussar Silk Festive Unstitched Dress Material
  await prisma.product.create({
    data: {
      name: "Traditional Tussar Silk Festive Unstitched Dress Material",
      nameBn: "ঐতিহ্যবাহী সফট তসর সিল্ক পার্টি আনস্টিচড ড্রেস মেটেরিয়াল কাপড়",
      slug: "traditional-tussar-silk-festive-unstitched-dress-material",
      sku: "SK-2026-002",
      description: "আভিজাত্যপূর্ণ সফট তসর সিল্ক কামিজ কাপড় (অল ওভার জরি উইভিং পার সহ), সেন্টুন সালোয়ার কাপড় ও রিচ উইভিং সিল্ক ওড়না কাপড়। যেকোনো উৎসব অনুষ্ঠানের জন্য অতুলনীয়। (শুধুমাত্র আনস্টিচড কাপড়)।",
      descriptionBn: "আভিজাত্যপূর্ণ তসর সিল্ক কামিজ কাপড়, সেন্টুন সালোয়ার ও রিচ উইভিং সিল্ক ওড়না কাপড়। (আনস্টিচড কাপড়)।",
      regularPrice: 3800,
      salePrice: 3150,
      isFeatured: true,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড থ্রি-পিস কাপড় সেট",
      categoryId: catSalwarFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
            altText: "Tussar Silk Unstitched Dress Material",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            altText: "Weaving Border Close Up",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "SK-2026-002-MAG", size: "আনস্টিচড সেট", color: "রয়্যাল মেজেন্টা ও গোল্ডেন / Magenta & Gold", stockQuantity: 22 },
        ],
      },
    },
  });

  // Product 9: Premium Digital Printed Lawn Cotton Unstitched Three-Piece
  await prisma.product.create({
    data: {
      name: "Premium Digital Printed Lawn Cotton Unstitched Three-Piece Fabric",
      nameBn: "ডিজিটাল প্রিন্টেড প্রিমিয়াম লন কটন আনস্টিচড থ্রি-পিস কাপড়",
      slug: "premium-digital-printed-lawn-cotton-unstitched-three-piece",
      sku: "SK-2026-003",
      description: "এক্সপোর্ট কোয়ালিটি সুইস লন কটন ডিজিটাল প্রিন্ট কামিজ কাপড়, ম্যাচিং সুতি ট্রাউজার কাপড় ও হালকা নরম শিফন ওড়না কাপড়। গরমের জন্য অত্যন্ত আরামদায়ক। (শুধুমাত্র আনস্টিচড কাপড়)।",
      descriptionBn: "সুইস লন কটন ডিজিটাল প্রিন্ট কামিজ, সুতি ট্রাউজার ও নরম শিফন ওড়না কাপড়। (আনস্টিচড কাপড়)।",
      regularPrice: 2150,
      salePrice: 1750,
      isFeatured: false,
      hasSizeVariants: false,
      sizeSelectionRequired: false,
      availableSizes: "আনস্টিচড থ্রি-পিস কাপড়",
      categoryId: catSalwarFabric.id,
      images: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
            altText: "Digital Printed Lawn Cotton Unstitched Three-Piece",
            displayOrder: 1,
            isThumbnail: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
            altText: "Printed Fabric Texture",
            displayOrder: 2,
          }
        ],
      },
      variants: {
        create: [
          { sku: "SK-2026-003-SEA", size: "আনস্টিচড সেট", color: "সি-গ্রিন ও লেমন / Sea Green & Lemon", stockQuantity: 25 },
        ],
      },
    },
  });

  console.log("Database seeded successfully with Categories (Panjabi, Burqa Fabric, Salwar Kameez Fabric) and Products!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
