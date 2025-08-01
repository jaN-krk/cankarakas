import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/lib/models/Restaurant';
import Category from '@/lib/models/Category';
import MenuItem from '@/lib/models/MenuItem';

// GET /api/menu/[slug] - Get restaurant menu data for public viewing
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Find restaurant by slug
    const restaurant = await Restaurant.findBySlug(params.slug);
    
    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    // Get categories for this restaurant
    const categories = await Category.findByRestaurant(restaurant._id, true);

    // Get menu items for this restaurant
    const menuItems = await MenuItem.findByRestaurant(restaurant._id, {
      availableOnly: true,
    });

    // Increment view count (optional analytics)
    // You can implement view tracking here if needed

    return NextResponse.json({
      success: true,
      data: {
        restaurant,
        categories,
        menuItems,
      },
    });

  } catch (error) {
    console.error('Error fetching menu data:', error);
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

