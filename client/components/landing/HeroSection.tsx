import React from 'react';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-orange-500/60 via-orange-500/30 to-transparent">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Fitness Journal</h1>
        <p className="text-xl md:text-2xl mb-8">{t('Landing.hero.tagline')}</p>
        <Link
          href="/auth/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300"
        >
          {t('Landing.hero.cta')}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
