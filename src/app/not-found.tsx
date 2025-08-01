'use client';

import { motion } from 'framer-motion';
import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold gradient-text mb-4">404</div>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full"
          >
            <Search className="w-8 h-8 text-neutral-400" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-4">
            Sayfa Bulunamadı
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir. 
            URL'yi kontrol edin veya ana sayfaya dönün.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center justify-center space-x-2 px-6 py-3 w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.history.back()}
            className="btn-ghost flex items-center justify-center space-x-2 px-6 py-3 w-full sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Geri Dön</span>
          </motion.button>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
            Popüler Sayfalar
          </h3>
          <div className="space-y-2">
            <Link 
              href="/admin/login"
              className="block text-primary-600 hover:text-primary-500 transition-colors"
            >
              Admin Paneli Girişi
            </Link>
            <Link 
              href="/admin/register"
              className="block text-primary-600 hover:text-primary-500 transition-colors"
            >
              Yeni Hesap Oluştur
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-100 dark:bg-secondary-900/20 rounded-full blur-xl"
        />
      </motion.div>
    </div>
  );
}

