import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterTabs } from '@/components/auth/register-tabs';

export const metadata: Metadata = {
  title: 'Registrarse | ZonaRetail',
  description: 'Crea tu cuenta',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Columna izquierda - Formulario */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Crear cuenta</h1>
              <p className="text-gray-500 text-sm mt-1">
                ¿Ya tienes cuenta?{' '}
                <Link href="/" className="text-gray-900 font-medium hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>

            <RegisterTabs />
          </div>
        </div>

        {/* Columna derecha - Información */}
        <div className="hidden lg:flex bg-gray-50 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-xl font-bold">T</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Vende en la tienda más grande de Latinoamérica
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Únete a miles de emprendedores que ya confían en nosotros para hacer crecer su
                negocio.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Llega a más clientes</h3>
                  <p className="text-sm text-gray-500">
                    Miles de compradores visitan nuestra plataforma cada día
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Comisiones competitivas</h3>
                  <p className="text-sm text-gray-500">
                    La comisión más baja del mercado, solo pagas por lo que vendes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Pagos seguros</h3>
                  <p className="text-sm text-gray-500">
                    Protegemos tu dinero y el de tus clientes en cada transacción
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Envíos integrados</h3>
                  <p className="text-sm text-gray-500">
                    Gestión de envíos fácil y con las mejores tarifas
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">+10,000</span> vendedores activos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
