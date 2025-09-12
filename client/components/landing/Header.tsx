'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeToggle from '@/components/common/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          Fitness Journal
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-200"
          >
            {t('Landing.navigation.about')}
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-200"
          >
            {t('Landing.navigation.contact')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-200"
          >
            {t('Landing.navigation.login')}
          </Link>
          <Link
            href="/auth/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition duration-200"
          >
            {t('Landing.navigation.register')}
          </Link>
        </div>

        {/* Mobile navigation */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden transition-transform duration-200 ${
            isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'
          }`}
        >
          <div className="px-4 py-2 space-y-2">
            <Link
              href="/about"
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {t('Landing.navigation.about')}
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {t('Landing.navigation.contact')}
            </Link>
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <div className="py-2">
              <ThemeToggle />
            </div>
            <Link
              href="/auth/login"
              className="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {t('Landing.navigation.login')}
            </Link>
            <Link
              href="/auth/register"
              className="block py-2 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
            >
              {t('Landing.navigation.register')}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
