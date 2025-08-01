import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/lib/models/Restaurant';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/admin/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/admin/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Connect to database and get active restaurants
    await connectDB();
    const restaurants = await Restaurant.find({ isActive: true }).select('slug updatedAt');
    
    // Generate menu pages
    const menuPages: MetadataRoute.Sitemap = restaurants.map((restaurant) => ({
      url: `${baseUrl}/menu/${restaurant.slug}`,
      lastModified: restaurant.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticPages, ...menuPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}

