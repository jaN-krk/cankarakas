import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/lib/models/Restaurant';
import Category from '@/lib/models/Category';
import MenuItem from '@/lib/models/MenuItem';
import { z } from 'zod';

const updateRestaurantSchema = z.object({
  name: z.string().min(2, 'Restoran adı en az 2 karakter olmalıdır').optional(),
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
  isActive: z.boolean().optional(),
});

// GET /api/restaurants/[id] - Get single restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const restaurant = await Restaurant.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurant,
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT /api/restaurants/[id] - Update restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateRestaurantSchema.parse(body);

    await connectDB();

    const restaurant = await Restaurant.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if it's being updated
    if (validatedData.slug && validatedData.slug !== restaurant.slug) {
      const existingRestaurant = await Restaurant.findOne({ 
        slug: validatedData.slug,
        _id: { $ne: params.id }
      });
      
      if (existingRestaurant) {
        return NextResponse.json(
          { success: false, message: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        );
      }
    }

    // Update restaurant
    Object.assign(restaurant, validatedData);
    await restaurant.save();

    return NextResponse.json({
      success: true,
      message: 'Restoran başarıyla güncellendi',
      data: restaurant,
    });

  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    
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
    
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// DELETE /api/restaurants/[id] - Delete restaurant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const restaurant = await Restaurant.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    // Delete all related data
    await MenuItem.deleteMany({ restaurantId: params.id });
    await Category.deleteMany({ restaurantId: params.id });
    await Restaurant.deleteOne({ _id: params.id });

    return NextResponse.json({
      success: true,
      message: 'Restoran ve tüm ilgili veriler başarıyla silindi',
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

