'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6"
        >
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-white mb-4">
            Bir Hata Oluştu
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin 
            veya daha sonra tekrar ziyaret edin.
          </p>
        </motion.div>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 mb-6 text-left"
          >
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              Hata Detayları:
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                Hata ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            className="btn-primary flex items-center justify-center space-x-2 px-6 py-3"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Tekrar Dene</span>
          </motion.button>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost flex items-center justify-center space-x-2 px-6 py-3 w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              <span>Ana Sayfaya Dön</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-neutral-500 dark:text-neutral-400"
        >
          <p>
            Sorun devam ederse, lütfen{' '}
            <a 
              href="mailto:destek@vizodex.com" 
              className="text-primary-600 hover:text-primary-500 underline"
            >
              destek@vizodex.com
            </a>{' '}
            adresinden bizimle iletişime geçin.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

