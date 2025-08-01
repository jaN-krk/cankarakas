'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Leaf, 
  Flame,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Restaurant, Category, MenuItem } from '@/types';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (slug) {
      fetchMenuData();
    }
  }, [slug]);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, menuItems]);

  const fetchMenuData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch restaurant data
      const restaurantResponse = await fetch(`/api/menu/${slug}`);
      const restaurantData = await restaurantResponse.json();
      
      if (restaurantData.success) {
        setRestaurant(restaurantData.data.restaurant);
        setCategories(restaurantData.data.categories);
        setMenuItems(restaurantData.data.menuItems);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Only show available items
    filtered = filtered.filter(item => item.isAvailable);

    setFilteredItems(filtered);
  };

  const formatPrice = (price: number, currency: string = 'TL') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency === 'TL' ? 'TRY' : currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getSpicyLevel = (level: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <Flame
        key={i}
        className={`w-4 h-4 ${
          i < level ? 'text-red-500' : 'text-neutral-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Restoran Bulunamadı
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Aradığınız restoran mevcut değil veya geçici olarak kapalı.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {restaurant.logo ? (
                <Image
                  src={restaurant.logo}
                  alt={restaurant.name}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {restaurant.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {restaurant.name}
                </h1>
                {restaurant.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {restaurant.description}
                  </p>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      {(restaurant.address || restaurant.phone || restaurant.website) && (
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
              {restaurant.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${restaurant.phone}`} className="hover:text-primary-600">
                    {restaurant.phone}
                  </a>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-600"
                  >
                    Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        {restaurant.settings.enableSearch && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Menüde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Categories */}
        {restaurant.settings.enableCategories && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                }`}
              >
                Tümü
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category._id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {restaurant.settings.showImages && item.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                              {item.name}
                            </h3>
                            {item.isNew && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Yeni
                              </span>
                            )}
                            {item.isPopular && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          
                          {restaurant.settings.showDescriptions && item.description && (
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-3 text-sm">
                            {item.isVegetarian && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Leaf className="w-4 h-4" />
                                <span>Vejetaryen</span>
                              </div>
                            )}
                            {item.spicyLevel && item.spicyLevel > 0 && (
                              <div className="flex items-center space-x-1">
                                {getSpicyLevel(item.spicyLevel)}
                              </div>
                            )}
                            {item.preparationTime && (
                              <div className="flex items-center space-x-1 text-neutral-500">
                                <Clock className="w-4 h-4" />
                                <span>{item.preparationTime} dk</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {restaurant.settings.showPrices && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-neutral-900 dark:text-white">
                              {formatPrice(item.price, restaurant.settings.currency)}
                            </div>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="text-sm text-neutral-500 line-through">
                                {formatPrice(item.originalPrice, restaurant.settings.currency)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              Menü öğesi bulunamadı
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchQuery ? 'Arama kriterlerinizi değiştirmeyi deneyin.' : 'Bu kategoride henüz ürün bulunmuyor.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Powered by <span className="font-semibold text-primary-600">Vizodex®</span>
            </p>
            {restaurant.socialMedia && (
              <div className="flex justify-center space-x-4 mt-4">
                {restaurant.socialMedia.instagram && (
                  <a
                    href={restaurant.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-pink-500 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {restaurant.socialMedia.facebook && (
                  <a
                    href={restaurant.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-blue-500 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {restaurant.socialMedia.twitter && (
                  <a
                    href={restaurant.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.image && (
                <div className="relative h-48">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {selectedItem.name}
                  </h2>
                  {restaurant.settings.showPrices && (
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary-600">
                        {formatPrice(selectedItem.price, restaurant.settings.currency)}
                      </div>
                      {selectedItem.originalPrice && selectedItem.originalPrice > selectedItem.price && (
                        <div className="text-sm text-neutral-500 line-through">
                          {formatPrice(selectedItem.originalPrice, restaurant.settings.currency)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {selectedItem.description && (
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {selectedItem.description}
                  </p>
                )}
                
                {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      İçindekiler
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {selectedItem.ingredients.join(', ')}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedItem.isVegetarian && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Vejetaryen
                    </span>
                  )}
                  {selectedItem.isVegan && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Vegan
                    </span>
                  )}
                  {selectedItem.isGlutenFree && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Glutensiz
                    </span>
                  )}
                  {selectedItem.isNew && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      Yeni
                    </span>
                  )}
                  {selectedItem.isPopular && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      Popüler
                    </span>
                  )}
                </div>
                
                {selectedItem.nutritionalInfo && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    {selectedItem.nutritionalInfo.calories && (
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedItem.nutritionalInfo.calories}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Kalori
                        </div>
                      </div>
                    )}
                    {selectedItem.nutritionalInfo.protein && (
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedItem.nutritionalInfo.protein}g
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Protein
                        </div>
                      </div>
                    )}
                    {selectedItem.nutritionalInfo.carbs && (
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedItem.nutritionalInfo.carbs}g
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Karbonhidrat
                        </div>
                      </div>
                    )}
                    {selectedItem.nutritionalInfo.fat && (
                      <div className="text-center">
                        <div className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {selectedItem.nutritionalInfo.fat}g
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          Yağ
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

