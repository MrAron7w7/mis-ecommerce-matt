// components/auth/client-register-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { registerAction } from '@/actions/auth/auth.action';

const schema = z
  .object({
    name: z.string().min(2, 'Ingresa tu nombre'),
    lastName: z.string().min(2, 'Ingresa tu apellido'),
    email: z.string().email('Correo inválido'),
    phone: z.string().min(8, 'Teléfono inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type Input = z.infer<typeof schema>;

export function ClientRegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Input) => {
    setServerError(null);
    const result = await registerAction({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      documentType: '',
      documentNumber: '',
    });

    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push('/iniciar-sesion');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder="Tu nombre"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
        <input
          {...register('lastName')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder="Tu apellido"
        />
        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          placeholder="+51 987654321"
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPass ? 'text' : 'password'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >
            {showPass ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
        <div className="relative">
          <input
            {...register('confirmPassword')}
            type={showConfirm ? 'text' : 'password'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          >
            {showConfirm ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-medium"
      >
        {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
