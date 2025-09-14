'use client';

import { useFormik } from 'formik';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

import React from 'react';
import * as Yup from 'yup';

interface Props {}

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm: React.FC<Props> = (props) => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const loginMutation = useLogin();
  const { t } = useI18n();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      loginMutation.mutate(values, {
        onSuccess: ({ user, token }) => {
          setAuth(user, token);
          router.push('/');
        },
        onError: (error) => {
          // Error is handled by the mutation, but we can add additional logic here if needed
          console.error('Login failed:', error);
        },
      });
    },
  });

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold">{t('login')}</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
        {loginMutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {loginMutation.error instanceof Error ? loginMutation.error.message : t('loginFailed')}
          </div>
        )}
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              {t('email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loginMutation.isPending}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={loginMutation.isPending}
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
            disabled={loginMutation.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-600)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-secondary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? t('loggingIn') : t('enter')}
          </button>
        </div>
        <div className="text-sm text-center">
          <Link
            href="/auth/register"
            className="font-medium text-[var(--brand-accent)] hover:text-[var(--brand-accent-600)]"
          >
            {t('dontHaveAccount')}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
