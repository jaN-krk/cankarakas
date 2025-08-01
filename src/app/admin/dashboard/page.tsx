'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  QrCode, 
  Menu, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Restaurant } from '@/types';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalMenuItems: 0,
    totalViews: 0,
    activeRestaurants: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    fetchRestaurants();
  }, [session, status, router]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      
      if (data.success) {
        setRestaurants(data.data);
        setStats({
          totalRestaurants: data.data.length,
          totalMenuItems: data.data.reduce((acc: number, r: Restaurant) => acc + (r as any).menuItemCount || 0, 0),
          totalViews: data.data.reduce((acc: number, r: Restaurant) => acc + (r as any).viewCount || 0, 0),
          activeRestaurants: data.data.filter((r: Restaurant) => r.isActive).length,
        });
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Restoranlar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    if (!confirm('Bu restoranı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Restoran başarıyla silindi');
        fetchRestaurants();
      } else {
        throw new Error('Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Restoran silinirken hata oluştu');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                Hoş geldiniz, {session?.user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/restaurants/new"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Restoran</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <Store className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Toplam Restoran
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalRestaurants}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                <Menu className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Menü Öğeleri
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalMenuItems}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 dark:bg-accent-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Toplam Görüntüleme
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalViews}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Aktif Restoran
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.activeRestaurants}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Restaurants List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Restoranlarım
            </h2>
          </div>
          
          {restaurants.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                Henüz restoran eklenmemiş
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                İlk restoranınızı ekleyerek dijital menü sisteminizi kurmaya başlayın.
              </p>
              <Link
                href="/admin/restaurants/new"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>İlk Restoranı Ekle</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                          {restaurant.name}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {restaurant.description || 'Açıklama eklenmemiş'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            restaurant.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {restaurant.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <span className="text-xs text-neutral-500">
                            /{restaurant.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/menu/${restaurant.slug}`}
                        target="_blank"
                        className="btn-ghost p-2"
                        title="Menüyü Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/restaurants/${restaurant._id}/qr`}
                        className="btn-ghost p-2"
                        title="QR Kod"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/restaurants/${restaurant._id}`}
                        className="btn-ghost p-2"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant._id)}
                        className="btn-ghost p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

