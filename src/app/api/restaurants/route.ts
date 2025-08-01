import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/lib/models/Restaurant';
import { z } from 'zod';

const createRestaurantSchema = z.object({
  name: z.string().min(2, 'Restoran adı en az 2 karakter olmalıdır'),
  slug: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  theme: z.object({
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    fontFamily: z.enum(['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato']).optional(),
    logoPosition: z.enum(['left', 'center', 'right']).optional(),
  }).optional(),
  settings: z.object({
    showPrices: z.boolean().optional(),
    showDescriptions: z.boolean().optional(),
    showImages: z.boolean().optional(),
    enableSearch: z.boolean().optional(),
    enableCategories: z.boolean().optional(),
    language: z.enum(['tr', 'en']).optional(),
    currency: z.string().optional(),
  }).optional(),
});

// GET /api/restaurants - Get user's restaurants
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const restaurants = await Restaurant.find({ 
      userId: session.user.id 
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: restaurants,
    });

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST /api/restaurants - Create new restaurant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createRestaurantSchema.parse(body);

    await connectDB();

    // Generate slug if not provided
    let slug = validatedData.slug;
    if (!slug) {
      slug = validatedData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Check if slug is unique
    const existingRestaurant = await Restaurant.findOne({ slug });
    if (existingRestaurant) {
      // Add random suffix to make it unique
      slug = `${slug}-${Math.random().toString(36).substr(2, 6)}`;
    }

    const restaurant = new Restaurant({
      ...validatedData,
      slug,
      userId: session.user.id,
    });

    await restaurant.save();

    return NextResponse.json({
      success: true,
      message: 'Restoran başarıyla oluşturuldu',
      data: restaurant,
    });

  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Geçersiz veri',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

