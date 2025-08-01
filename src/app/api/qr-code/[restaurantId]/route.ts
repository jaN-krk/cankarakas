import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/lib/models/Restaurant';
import { QRCodeGenerator } from '@/lib/qr-code';

// GET /api/qr-code/[restaurantId] - Generate QR code for restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
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

    // Find restaurant and verify ownership
    const restaurant = await Restaurant.findOne({
      _id: params.restaurantId,
      userId: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'png';
    const size = parseInt(searchParams.get('size') || '512');
    const margin = parseInt(searchParams.get('margin') || '2');
    const darkColor = searchParams.get('dark') || restaurant.theme.primaryColor;
    const lightColor = searchParams.get('light') || '#FFFFFF';

    // Generate QR code based on format
    if (format === 'svg') {
      const svg = await QRCodeGenerator.generateMenuQRSVG(restaurant.slug, {
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });

      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="${restaurant.slug}-qr.svg"`,
        },
      });
    } else if (format === 'buffer') {
      const buffer = await QRCodeGenerator.generateMenuQRBuffer(restaurant.slug, {
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        type: 'image/png',
      });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${restaurant.slug}-qr.png"`,
        },
      });
    } else {
      // Default: return data URL
      const dataURL = await QRCodeGenerator.generateMenuQR(restaurant.slug, {
        size,
        margin,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        type: 'image/png',
      });

      return NextResponse.json({
        success: true,
        data: {
          qrCode: dataURL,
          menuUrl: `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurant.slug}`,
          restaurant: {
            name: restaurant.name,
            slug: restaurant.slug,
          },
        },
      });
    }

  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { success: false, message: 'QR kod oluşturulamadı' },
      { status: 500 }
    );
  }
}

// POST /api/qr-code/[restaurantId] - Generate custom QR code
export async function POST(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
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
    const { 
      size = 512, 
      margin = 2, 
      darkColor, 
      lightColor = '#FFFFFF',
      errorCorrectionLevel = 'M',
      format = 'dataURL'
    } = body;

    await connectDB();

    // Find restaurant and verify ownership
    const restaurant = await Restaurant.findOne({
      _id: params.restaurantId,
      userId: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restoran bulunamadı' },
        { status: 404 }
      );
    }

    const finalDarkColor = darkColor || restaurant.theme.primaryColor;
    const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL}/menu/${restaurant.slug}`;

    let qrCode;
    
    switch (format) {
      case 'svg':
        qrCode = await QRCodeGenerator.generateSVG(menuUrl, {
          size,
          margin,
          color: {
            dark: finalDarkColor,
            light: lightColor,
          },
          errorCorrectionLevel,
        });
        break;
        
      case 'buffer':
        qrCode = await QRCodeGenerator.generateBuffer(menuUrl, {
          size,
          margin,
          color: {
            dark: finalDarkColor,
            light: lightColor,
          },
          errorCorrectionLevel,
          type: 'image/png',
        });
        // Convert buffer to base64 for JSON response
        qrCode = `data:image/png;base64,${qrCode.toString('base64')}`;
        break;
        
      default:
        qrCode = await QRCodeGenerator.generateDataURL(menuUrl, {
          size,
          margin,
          color: {
            dark: finalDarkColor,
            light: lightColor,
          },
          errorCorrectionLevel,
          type: 'image/png',
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        qrCode,
        menuUrl,
        settings: {
          size,
          margin,
          darkColor: finalDarkColor,
          lightColor,
          errorCorrectionLevel,
          format,
        },
        restaurant: {
          name: restaurant.name,
          slug: restaurant.slug,
        },
      },
    });

  } catch (error) {
    console.error('Error generating custom QR code:', error);
    return NextResponse.json(
      { success: false, message: 'Özel QR kod oluşturulamadı' },
      { status: 500 }
    );
  }
}

