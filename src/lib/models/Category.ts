import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@/types';

export interface CategoryDocument extends Omit<Category, '_id'>, Document {}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [100, 'English category name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxlength: [300, 'English description cannot exceed 300 characters'],
    },
    image: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [50, 'Icon name cannot exceed 50 characters'],
    },
    order: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Order cannot be negative'],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
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
        ret.restaurantId = ret.restaurantId.toString();
        return ret;
      },
    },
  }
);

// Indexes for better performance
CategorySchema.index({ restaurantId: 1, order: 1 });
CategorySchema.index({ restaurantId: 1, isActive: 1 });
CategorySchema.index({ restaurantId: 1, name: 1 });

// Compound index to ensure unique category names per restaurant
CategorySchema.index({ restaurantId: 1, name: 1 }, { unique: true });

// Virtual to get menu items count
CategorySchema.virtual('itemCount', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'categoryId',
  count: true,
});

// Static method to find categories by restaurant
CategorySchema.statics.findByRestaurant = function (restaurantId: string, activeOnly = true) {
  const query: any = { restaurantId };
  if (activeOnly) {
    query.isActive = true;
  }
  return this.find(query).sort({ order: 1, name: 1 });
};

// Static method to get next order number
CategorySchema.statics.getNextOrder = async function (restaurantId: string) {
  const lastCategory = await this.findOne({ restaurantId }).sort({ order: -1 });
  return lastCategory ? lastCategory.order + 1 : 1;
};

// Instance method to get localized name
CategorySchema.methods.getLocalizedName = function (locale: 'tr' | 'en' = 'tr') {
  return locale === 'en' && this.nameEn ? this.nameEn : this.name;
};

// Instance method to get localized description
CategorySchema.methods.getLocalizedDescription = function (locale: 'tr' | 'en' = 'tr') {
  return locale === 'en' && this.descriptionEn ? this.descriptionEn : this.description;
};

// Pre-save middleware to set order if not provided
CategorySchema.pre('save', async function (next) {
  if (this.isNew && this.order === 0) {
    const nextOrder = await (this.constructor as any).getNextOrder(this.restaurantId);
    this.order = nextOrder;
  }
  next();
});

// Pre-remove middleware to update menu items
CategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  // Update all menu items in this category to be uncategorized or delete them
  const MenuItem = mongoose.model('MenuItem');
  await MenuItem.updateMany(
    { categoryId: this._id },
    { $unset: { categoryId: 1 } }
  );
  next();
});

export default mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

