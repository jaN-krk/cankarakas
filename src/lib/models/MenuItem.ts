import mongoose, { Schema, Document } from 'mongoose';
import { MenuItem } from '@/types';

export interface MenuItemDocument extends Omit<MenuItem, '_id'>, Document {}

const MenuItemSchema = new Schema<MenuItemDocument>(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [150, 'Menu item name cannot exceed 150 characters'],
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [150, 'English menu item name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxlength: [500, 'English description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [999999, 'Price cannot exceed 999,999'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      max: [999999, 'Original price cannot exceed 999,999'],
      validate: {
        validator: function (this: MenuItemDocument, value: number) {
          return !value || value >= this.price;
        },
        message: 'Original price must be greater than or equal to current price',
      },
    },
    image: {
      type: String,
      trim: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    ingredients: [{
      type: String,
      trim: true,
      maxlength: [100, 'Ingredient name cannot exceed 100 characters'],
    }],
    allergens: [{
      type: String,
      trim: true,
      enum: [
        'gluten', 'dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 
        'peanuts', 'soy', 'sesame', 'sulfites', 'mustard', 'celery'
      ],
    }],
    nutritionalInfo: {
      calories: {
        type: Number,
        min: [0, 'Calories cannot be negative'],
        max: [9999, 'Calories cannot exceed 9,999'],
      },
      protein: {
        type: Number,
        min: [0, 'Protein cannot be negative'],
        max: [999, 'Protein cannot exceed 999g'],
      },
      carbs: {
        type: Number,
        min: [0, 'Carbs cannot be negative'],
        max: [999, 'Carbs cannot exceed 999g'],
      },
      fat: {
        type: Number,
        min: [0, 'Fat cannot be negative'],
        max: [999, 'Fat cannot exceed 999g'],
      },
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters'],
    }],
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    isPopular: {
      type: Boolean,
      required: true,
      default: false,
    },
    isNew: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVegetarian: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVegan: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      required: true,
      default: false,
    },
    spicyLevel: {
      type: Number,
      min: [0, 'Spicy level must be between 0 and 3'],
      max: [3, 'Spicy level must be between 0 and 3'],
      default: 0,
    },
    preparationTime: {
      type: Number,
      min: [0, 'Preparation time cannot be negative'],
      max: [300, 'Preparation time cannot exceed 300 minutes'],
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        ret.categoryId = ret.categoryId.toString();
        ret.restaurantId = ret.restaurantId.toString();
        return ret;
      },
    },
  }
);

// Indexes for better performance
MenuItemSchema.index({ restaurantId: 1, categoryId: 1, order: 1 });
MenuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
MenuItemSchema.index({ restaurantId: 1, isPopular: 1 });
MenuItemSchema.index({ restaurantId: 1, name: 'text', description: 'text' });
MenuItemSchema.index({ restaurantId: 1, tags: 1 });
MenuItemSchema.index({ restaurantId: 1, isVegetarian: 1 });
MenuItemSchema.index({ restaurantId: 1, isVegan: 1 });
MenuItemSchema.index({ restaurantId: 1, isGlutenFree: 1 });

// Virtual for discount percentage
MenuItemSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for formatted price
MenuItemSchema.virtual('formattedPrice').get(function () {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(this.price);
});

// Static method to find items by restaurant
MenuItemSchema.statics.findByRestaurant = function (
  restaurantId: string, 
  options: {
    categoryId?: string;
    availableOnly?: boolean;
    popularOnly?: boolean;
    search?: string;
    tags?: string[];
    dietary?: {
      vegetarian?: boolean;
      vegan?: boolean;
      glutenFree?: boolean;
    };
    limit?: number;
    skip?: number;
  } = {}
) {
  const query: any = { restaurantId };
  
  if (options.categoryId) {
    query.categoryId = options.categoryId;
  }
  
  if (options.availableOnly) {
    query.isAvailable = true;
  }
  
  if (options.popularOnly) {
    query.isPopular = true;
  }
  
  if (options.search) {
    query.$text = { $search: options.search };
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  if (options.dietary) {
    if (options.dietary.vegetarian) query.isVegetarian = true;
    if (options.dietary.vegan) query.isVegan = true;
    if (options.dietary.glutenFree) query.isGlutenFree = true;
  }
  
  let queryBuilder = this.find(query)
    .populate('categoryId', 'name nameEn')
    .sort({ order: 1, name: 1 });
  
  if (options.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }
  
  if (options.skip) {
    queryBuilder = queryBuilder.skip(options.skip);
  }
  
  return queryBuilder;
};

// Static method to get next order number
MenuItemSchema.statics.getNextOrder = async function (categoryId: string) {
  const lastItem = await this.findOne({ categoryId }).sort({ order: -1 });
  return lastItem ? lastItem.order + 1 : 1;
};

// Instance method to get localized name
MenuItemSchema.methods.getLocalizedName = function (locale: 'tr' | 'en' = 'tr') {
  return locale === 'en' && this.nameEn ? this.nameEn : this.name;
};

// Instance method to get localized description
MenuItemSchema.methods.getLocalizedDescription = function (locale: 'tr' | 'en' = 'tr') {
  return locale === 'en' && this.descriptionEn ? this.descriptionEn : this.description;
};

// Instance method to check if item has dietary restrictions
MenuItemSchema.methods.getDietaryInfo = function () {
  return {
    vegetarian: this.isVegetarian,
    vegan: this.isVegan,
    glutenFree: this.isGlutenFree,
    spicyLevel: this.spicyLevel,
    allergens: this.allergens,
  };
};

// Pre-save middleware to set order if not provided
MenuItemSchema.pre('save', async function (next) {
  if (this.isNew && this.order === 0) {
    const nextOrder = await (this.constructor as any).getNextOrder(this.categoryId);
    this.order = nextOrder;
  }
  
  // Ensure vegan items are also vegetarian
  if (this.isVegan) {
    this.isVegetarian = true;
  }
  
  next();
});

// Pre-save middleware to validate original price
MenuItemSchema.pre('save', function (next) {
  if (this.originalPrice && this.originalPrice < this.price) {
    const error = new Error('Original price must be greater than or equal to current price');
    return next(error);
  }
  next();
});

export default mongoose.models.MenuItem || mongoose.model<MenuItemDocument>('MenuItem', MenuItemSchema);

