import React from 'react';
import { useI18n } from '@/lib/i18n';
import { FaListCheck } from 'react-icons/fa6';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { LuGoal } from 'react-icons/lu';
import { MdInsights } from 'react-icons/md';

const FeaturesSection = () => {
  const { t } = useI18n();

  type FeatureKey = 'track' | 'progress' | 'goals' | 'insights';

  const features: FeatureKey[] = ['track', 'progress', 'goals', 'insights'];
  const icons: Record<FeatureKey, JSX.Element> = {
    track: <FaListCheck className="w-8 h-8" />,
    progress: <FaArrowTrendUp className="w-8 h-8" />,
    goals: <LuGoal className="w-8 h-8" />,
    insights: <MdInsights className="w-8 h-8" />,
  };

  return (
    <section className="py-20 px-4 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">{t('Landing.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature}
              className="p-6 rounded-lg bg-[var(--component-bg)] text-center transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[var(--brand-secondary)] rounded-full">
                {icons[feature]}
              </div>
              <h3 className="text-xl font-semibold mb-2e">
                {t(`Landing.features.${feature}.title`)}
              </h3>
              <p className="text-[var(--muted)]">{t(`Landing.features.${feature}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
