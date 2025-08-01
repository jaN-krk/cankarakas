import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.createUser({
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      password: validatedData.password,
      role: 'owner', // Default role for new registrations
    });
    
    // Return success response (without password)
    const { password, ...userWithoutPassword } = user.toJSON();
    
    return NextResponse.json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu',
      data: userWithoutPassword,
    });
    
  } catch (error: any) {
    console.error('Register error:', error);
    
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
        { success: false, message: 'Bu email adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

