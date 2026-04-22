'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerSchema, RegisterInput } from '@/lib/schemas/auth.schema';
import { registerAction } from '@/actions/auth/auth.action';

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput): Promise<void> => {
    setServerError(null);
    const result = await registerAction(data);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    router.push('/iniciar-sesion');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          placeholder="Tu nombre"
          {...register('name')}
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirmar contraseña
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
      </button>

      <p className="text-sm text-center text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <a href="/iniciar-sesion" className="text-black font-medium hover:underline">
          Inicia sesión
        </a>
      </p>
    </form>
  );
}
