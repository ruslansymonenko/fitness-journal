import React from 'react';
import { useI18n } from '@/lib/i18n';

const FeaturesSection = () => {
  const { t } = useI18n();

  type FeatureKey = 'track' | 'progress' | 'goals' | 'insights';

  const features: FeatureKey[] = ['track', 'progress', 'goals', 'insights'];
  const icons: Record<FeatureKey, JSX.Element> = {
    track: (
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    progress: (
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    goals: (
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    insights: (
      <svg
        className="w-8 h-8 text-blue-600 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  };

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {t('Landing.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 text-center transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                {icons[feature]}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t(`Landing.features.${feature}.title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`Landing.features.${feature}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
