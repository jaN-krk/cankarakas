import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

export interface UserDocument extends Omit<User, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordHash(password: string): Promise<string>;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      maxlength: [100, 'Email cannot exceed 100 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'owner', 'staff'],
      default: 'owner',
    },
    avatar: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]+$/, 'Please enter a valid phone number'],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    restaurantIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
    }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret._id = ret._id.toString();
        ret.restaurantIds = ret.restaurantIds.map((id: any) => id.toString());
        delete ret.password;
        return ret;
      },
    },
  }
);

// Indexes for better performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ isActive: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ restaurantIds: 1 });

// Virtual for full name (if we add firstName/lastName later)
UserSchema.virtual('displayName').get(function () {
  return this.name;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to generate password hash (for password reset)
UserSchema.methods.generatePasswordHash = async function (password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

// Static method to find user by email
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

// Static method to find user with password (for authentication)
UserSchema.statics.findByEmailWithPassword = function (email: string) {
  return this.findOne({ email: email.toLowerCase(), isActive: true }).select('+password');
};

// Static method to create user with hashed password
UserSchema.statics.createUser = async function (userData: {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'owner' | 'staff';
  phone?: string;
}) {
  const user = new this(userData);
  return await user.save();
};

// Instance method to update last login
UserSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

// Instance method to add restaurant
UserSchema.methods.addRestaurant = function (restaurantId: string) {
  if (!this.restaurantIds.includes(restaurantId)) {
    this.restaurantIds.push(restaurantId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove restaurant
UserSchema.methods.removeRestaurant = function (restaurantId: string) {
  this.restaurantIds = this.restaurantIds.filter(
    (id: any) => id.toString() !== restaurantId
  );
  return this.save();
};

// Instance method to check if user has access to restaurant
UserSchema.methods.hasRestaurantAccess = function (restaurantId: string): boolean {
  if (this.role === 'admin') return true;
  return this.restaurantIds.some((id: any) => id.toString() === restaurantId);
};

// Pre-remove middleware to clean up related data
UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    // Remove user from all restaurants they own
    const Restaurant = mongoose.model('Restaurant');
    await Restaurant.updateMany(
      { userId: this._id },
      { isActive: false }
    );
    next();
  } catch (error) {
    next(error as Error);
  }
});

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

