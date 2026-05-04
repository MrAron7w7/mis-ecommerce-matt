'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, Eye, EyeOff, ShoppingBag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/lib/schemas/auth.schema';
import { loginAction } from '@/actions/auth/auth.action';
import { LogoutModal } from '../ui/logout-modal';

type AuthModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  action: 'login' | 'logout';
};

export default function AuthModal({ open, setOpen, action }: AuthModalProps) {
  const router = useRouter();

  if (!open) return null;

  // Modal de logout
  if (action === 'logout') {
    return <LogoutModal isOpen={open} onClose={() => setOpen(false)} />;
  }

  // Modal de login
  return (
    <div
      className="fixed inset-0 bg-black/50 z-9999 flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-light text-gray-900">Bienvenido de vuelta</h2>
          <p className="text-gray-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
        </div>

        {/* Login Form */}
        <div className="p-6">
          <ModalLoginForm onSuccess={() => setOpen(false)} />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => {
                setOpen(false);
                router.push('/registrarse');
              }}
              className="text-gray-900 font-medium hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente de login para el modal
function ModalLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput): Promise<void> => {
    setServerError(null);
    const result = await loginAction(data);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    onSuccess();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-red-600 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 font-medium mt-2"
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
