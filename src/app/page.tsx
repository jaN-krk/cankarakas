'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Smartphone, Store, Zap, Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const features = [
    {
      icon: QrCode,
      title: 'QR Kod Menü',
      description: 'Müşterileriniz QR kodu okutarak anında menünüze erişebilir',
    },
    {
      icon: Smartphone,
      title: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda mükemmel görünüm ve kullanım deneyimi',
    },
    {
      icon: Store,
      title: 'Kolay Yönetim',
      description: 'Admin paneli ile menünüzü kolayca güncelleyin',
    },
    {
      icon: Zap,
      title: 'Hızlı & Güvenli',
      description: 'Modern teknoloji ile hızlı yükleme ve güvenli veri',
    },
    {
      icon: Globe,
      title: 'Çok Dilli',
      description: 'Türkçe ve İngilizce dil desteği',
    },
    {
      icon: Shield,
      title: 'Güvenilir',
      description: 'Verileriniz güvende, 7/24 teknik destek',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-neutral-700/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold gradient-text">
              Vizodex
            </span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/admin/login"
              className="btn-primary text-sm"
            >
              Admin Girişi
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance">
              <span className="gradient-text">Dijital Menü</span>
              <br />
              <span className="text-neutral-800 dark:text-neutral-200">
                Geleceği
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 text-balance max-w-2xl mx-auto">
              Restoranınız için modern, QR kod tabanlı dijital menü sistemi. 
              Kolay yönetim, mobil uyumlu tasarım.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/demo"
                className="btn-primary text-lg px-8 py-4"
              >
                Demo Görün
              </Link>
              <Link
                href="/admin/register"
                className="btn-outline text-lg px-8 py-4"
              >
                Ücretsiz Başlayın
              </Link>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white dark:bg-neutral-800 rounded-3xl shadow-strong p-8 border border-neutral-200 dark:border-neutral-700">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                      QR Kodu Okutun
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full h-64 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 rounded-2xl p-4 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                          Restoran Menüsü
                        </h3>
                        <Smartphone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full"></div>
                        <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full w-3/4"></div>
                        <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded-full w-1/2"></div>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                      Menüyü Görüntüleyin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-neutral-800/50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-neutral-800 dark:text-neutral-200">
              Neden <span className="gradient-text">Vizodex</span>?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Modern restoran işletmeciliği için ihtiyacınız olan tüm özellikler
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover p-8 text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-neutral-800 dark:text-neutral-200">
              Hemen <span className="gradient-text">Başlayın</span>
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
              Dijital menü sisteminizi kurmak sadece birkaç dakika sürüyor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/admin/register"
                className="btn-primary text-lg px-8 py-4"
              >
                Ücretsiz Hesap Oluştur
              </Link>
              <Link
                href="/contact"
                className="btn-ghost text-lg px-8 py-4"
              >
                İletişime Geçin
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold">Vizodex</span>
              </div>
              <p className="text-neutral-400 mb-4 max-w-md">
                Modern restoran ve kafeler için dijital menü çözümleri. 
                QR kod teknolojisi ile müşteri deneyimini geliştirin.
              </p>
              <p className="text-sm text-neutral-500">
                Powered by <span className="font-semibold">Vizodex®</span>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Yardım</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">İletişim</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Gizlilik</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
            <p>&copy; 2024 Vizodex. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

