'use client';

import RegisterForm from '@/components/public/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--component-bg)] text-[var(--foreground)] py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
