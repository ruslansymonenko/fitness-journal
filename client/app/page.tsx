'use client';

import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FooterSection from '@/components/landing/FooterSection';

const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FooterSection />
      </main>
    </>
  );
};

export default LandingPage;
