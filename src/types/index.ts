// Database Models
export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoPosition: 'left' | 'center' | 'right';
  };
  settings: {
    showPrices: boolean;
    showDescriptions: boolean;
    showImages: boolean;
    enableSearch: boolean;
    enableCategories: boolean;
    language: 'tr' | 'en';
    currency: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Category {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tags?: string[];
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  preparationTime?: number;
  order: number;
  categoryId: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'owner' | 'staff';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  restaurantIds: string[];
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface RestaurantFormData {
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    logoPosition: 'left' | 'center' | 'right';
  };
  settings: {
    showPrices: boolean;
    showDescriptions: boolean;
    showImages: boolean;
    enableSearch: boolean;
    enableCategories: boolean;
    language: 'tr' | 'en';
    currency: string;
  };
}

export interface CategoryFormData {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface MenuItemFormData {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: number;
  originalPrice?: number;
  ingredients?: string[];
  allergens?: string[];
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  tags?: string[];
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  preparationTime?: number;
  order: number;
  categoryId: string;
}

// UI Component Types
export interface MenuItemCardProps {
  item: MenuItem;
  onClick?: (item: MenuItem) => void;
  showPrice?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
  className?: string;
}

export interface CategoryTabProps {
  category: Category;
  isActive: boolean;
  onClick: (categoryId: string) => void;
}

export interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Utility Types
export type Locale = 'tr' | 'en';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  tr: Translation;
  en: Translation;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  validationErrors?: ValidationError[];
}

// File Upload Types
export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

// Search and Filter Types
export interface MenuFilters {
  categoryId?: string;
  search?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isAvailable?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
  spicyLevel?: number;
  tags?: string[];
}

export interface SortOption {
  field: keyof MenuItem;
  direction: 'asc' | 'desc';
  label: string;
}

// Analytics Types
export interface MenuAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  popularItems: {
    itemId: string;
    name: string;
    views: number;
  }[];
  categoryViews: {
    categoryId: string;
    name: string;
    views: number;
  }[];
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  timeStats: {
    hour: number;
    views: number;
  }[];
}

