// components/auth/seller-register-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import { registerSellerAction } from '@/actions/auth/register-seller.action';

const schema = z
  .object({
    name: z.string().min(2, 'Ingresa tu nombre'),
    lastName: z.string().min(2, 'Ingresa tu apellido'),
    email: z.string().email('Correo inválido'),
    phone: z.string().min(8, 'Teléfono inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z.string(),
    businessName: z.string().min(2, 'Nombre del negocio requerido'),
    businessType: z.string().min(1, 'Selecciona un tipo'),
    taxIdType: z.string().min(1, 'Selecciona un tipo'),
    taxIdNumber: z.string().min(8, 'Número inválido'),
    address: z.string().min(5, 'Dirección requerida'),
    experience: z.string().min(20, 'Mínimo 20 caracteres'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type Input = z.infer<typeof schema>;

const BUSINESS_TYPES = [
  'Tecnología',
  'Ropa y moda',
  'Alimentos',
  'Electrónica',
  'Hogar',
  'Deportes',
  'Salud',
  'Otro',
];

export function SellerRegisterForm() {
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
    const result = await registerSellerAction(data);
    if (result.error) {
      setServerError(result.error);
      return;
    }
    router.push('/iniciar-sesion?registered=seller');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Datos personales */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Datos personales
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register('name')}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register('lastName')}
              placeholder="Apellido"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('phone')}
            placeholder="Celular"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                {showPass ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              >
                {showConfirm ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Datos del negocio */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Datos del negocio
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register('businessName')}
              placeholder="Nombre del negocio"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {errors.businessName && (
              <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>
            )}
          </div>
          <div>
            <select
              {...register('businessType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
            >
              <option value="">Tipo de negocio</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <select
              {...register('taxIdType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 bg-white"
            >
              <option value="">Tipo de documento</option>
              <option value="RUC">RUC</option>
              <option value="DNI">DNI</option>
              <option value="CE">Carnet de Extranjería</option>
            </select>
            {errors.taxIdType && (
              <p className="text-red-500 text-xs mt-1">{errors.taxIdType.message}</p>
            )}
          </div>
          <div>
            <input
              {...register('taxIdNumber')}
              placeholder="Número de documento"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            {errors.taxIdNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.taxIdNumber.message}</p>
            )}
          </div>
        </div>

        <div>
          <input
            {...register('address')}
            placeholder="Dirección del negocio"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <textarea
            {...register('experience')}
            rows={3}
            placeholder="Cuéntanos sobre tu experiencia y por qué quieres vender con nosotros..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
          />
          {errors.experience && (
            <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>
          )}
        </div>
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
        {isSubmitting ? 'Enviando...' : 'Solicitar cuenta de vendedor'}
      </button>
    </form>
  );
}
