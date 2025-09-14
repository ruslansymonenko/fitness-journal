'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

interface Props {}

const RegisterForm: React.FC<Props> = (props) => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const registerMutation = useRegister();
  const { t } = useI18n();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      registerMutation.mutate(values, {
        onSuccess: ({ user, token }) => {
          setAuth(user, token);
          router.push('/');
        },
        onError: (error) => {
          console.error('Registration failed:', error);
        },
      });
    },
  });

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold">{t('registration')}</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        {registerMutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {registerMutation.error instanceof Error
              ? registerMutation.error.message
              : 'Registration failed'}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="name" className="sr-only">
              {t('name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={registerMutation.isPending}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('name')}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={registerMutation.isPending}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('email')}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              {t('password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={registerMutation.isPending}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={t('password')}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? <span>{t('creatingAccount')}</span> : t('signUp')}
          </button>
        </div>
        <div className="text-sm text-center">
          <Link
            href="/auth/login"
            className="font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent-600)]"
          >
            {t('alreadyHaveAccount')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
