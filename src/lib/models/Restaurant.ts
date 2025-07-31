import mongoose, { Schema, Document } from 'mongoose';
import { Restaurant } from '@/types';

export interface RestaurantDocument extends Omit<Restaurant, '_id'>, Document {}

const RestaurantSchema = new Schema<RestaurantDocument>(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Restaurant slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
      maxlength: [50, 'Slug cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid website URL'],
    },
    socialMedia: {
      instagram: {
        type: String,
        trim: true,
      },
      facebook: {
        type: String,
        trim: true,
      },
      twitter: {
        type: String,
        trim: true,
      },
    },
    theme: {
      primaryColor: {
        type: String,
        required: true,
        default: '#0ea5e9',
        match: [/^#[0-9A-Fa-f]{6}$/, 'Primary color must be a valid hex color'],
      },
      secondaryColor: {
        type: String,
        required: true,
        default: '#eab308',
        match: [/^#[0-9A-Fa-f]{6}$/, 'Secondary color must be a valid hex color'],
      },
      fontFamily: {
        type: String,
        required: true,
        default: 'Inter',
        enum: ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato'],
      },
      logoPosition: {
        type: String,
        required: true,
        default: 'center',
        enum: ['left', 'center', 'right'],
      },
    },
    settings: {
      showPrices: {
        type: Boolean,
        required: true,
        default: true,
      },
      showDescriptions: {
        type: Boolean,
        required: true,
        default: true,
      },
      showImages: {
        type: Boolean,
        required: true,
        default: true,
      },
      enableSearch: {
        type: Boolean,
        required: true,
        default: true,
      },
      enableCategories: {
        type: Boolean,
        required: true,
        default: true,
      },
      language: {
        type: String,
        required: true,
        default: 'tr',
        enum: ['tr', 'en'],
      },
      currency: {
        type: String,
        required: true,
        default: 'TL',
        maxlength: [10, 'Currency cannot exceed 10 characters'],
      },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        ret.userId = ret.userId.toString();
        return ret;
      },
    },
  }
);

// Indexes for better performance
RestaurantSchema.index({ slug: 1 }, { unique: true });
RestaurantSchema.index({ userId: 1 });
RestaurantSchema.index({ isActive: 1 });
RestaurantSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug if not provided
RestaurantSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Virtual for QR code URL
RestaurantSchema.virtual('qrCodeUrl').get(function () {
  return `${process.env.NEXT_PUBLIC_APP_URL}/restaurant/${this.slug}`;
});

// Virtual for menu URL
RestaurantSchema.virtual('menuUrl').get(function () {
  return `${process.env.NEXT_PUBLIC_APP_URL}/menu/${this.slug}`;
});

// Static method to find by slug
RestaurantSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug, isActive: true });
};

// Instance method to generate QR code data
RestaurantSchema.methods.getQRCodeData = function () {
  return {
    url: this.menuUrl,
    name: this.name,
    description: this.description,
  };
};

export default mongoose.models.Restaurant || mongoose.model<RestaurantDocument>('Restaurant', RestaurantSchema);

