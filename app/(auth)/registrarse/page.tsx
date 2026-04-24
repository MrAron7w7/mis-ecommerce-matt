import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import {
  Shield,
  Truck,
  RefreshCw,
  Headphones,
  Sparkles,
  Star,
  Clock,
  CreditCard,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Registrarse | Tu Tienda',
  description: 'Crea tu cuenta y disfruta de beneficios exclusivos',
};

export default function RegisterPage() {
  const benefits = [
    {
      icon: Truck,
      title: 'Envío gratis',
      description: 'En compras superiores a $100',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Compra segura',
      description: 'Protegemos tus datos',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: RefreshCw,
      title: 'Devoluciones gratis',
      description: 'Hasta 30 días',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Headphones,
      title: 'Soporte 24/7',
      description: 'Atención personalizada',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Clock,
      title: 'Entrega rápida',
      description: 'Envíos en 24-48h',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: CreditCard,
      title: 'Múltiples medios de pago',
      description: 'Tarjetas, transferencias, efectivo',
      color: 'bg-pink-50 text-pink-600',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna izquierda - Formulario */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Crear cuenta</h1>
                <p className="text-gray-500 text-sm mt-2">
                  Completa el formulario para comenzar tu experiencia
                </p>
              </div>

              <RegisterForm />

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="/iniciar-sesion"
                    className="text-gray-900 font-medium hover:underline"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha - Beneficios */}
          <div className="order-1 lg:order-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 text-white h-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-light mb-2">Beneficios exclusivos</h2>
                <p className="text-gray-300 text-sm">Al registrarte obtienes acceso a:</p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition group"
                  >
                    <div className={`p-2 rounded-lg ${benefit.color} bg-opacity-100`}>
                      <benefit.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{benefit.title}</h3>
                      <p className="text-sm text-gray-300">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo badge */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm">¡10% de descuento en tu primera compra!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
