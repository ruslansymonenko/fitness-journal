import React from 'react';
import { useI18n } from '@/lib/i18n';

const HowItWorksSection = () => {
  const { t } = useI18n();

  const steps = ['step1', 'step2', 'step3'] as const;

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {t('Landing.howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className="text-center transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t(`Landing.howItWorks.${step}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`Landing.howItWorks.${step}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
