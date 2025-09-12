import React from 'react';
import { useI18n } from '@/lib/i18n';

const TestimonialsSection = () => {
  const { t } = useI18n();
  const testimonials = ['testimonial1', 'testimonial2', 'testimonial3'] as const;

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          {t('Landing.testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial}
              className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 transform hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t(`Landing.testimonials.${testimonial}.name`)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t(`Landing.testimonials.${testimonial}.role`)}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {t(`Landing.testimonials.${testimonial}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
