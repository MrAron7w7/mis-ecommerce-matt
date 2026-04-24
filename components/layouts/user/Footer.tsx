// components/footer/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, CreditCard, Truck, Shield, Headphones, User } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Columna 1 - Logo y descripción */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo-white.png" alt="Logo" width={100} height={33} />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Tu tienda online de confianza. Encuentra todo lo que necesitas con los mejores precios
              y envíos rápidos.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h4 className="text-white font-medium mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/productos" className="hover:text-white transition">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/new" className="hover:text-white transition">
                  Novedades
                </Link>
              </li>
              <li>
                <Link href="/sales" className="hover:text-white transition">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/destacados" className="hover:text-white transition">
                  Más vendidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Soporte */}
          <div>
            <h4 className="text-white font-medium mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contacto" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-white transition">
                  Envíos y entregas
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="hover:text-white transition">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/preguntas-frecuentes" className="hover:text-white transition">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/tallas" className="hover:text-white transition">
                  Guía de tallas
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Contacto */}
          <div>
            <h4 className="text-white font-medium mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Av. Principal 123, Ciudad</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} />
                <a href="tel:+123456789" className="text-gray-400 hover:text-white transition">
                  +1 234 567 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} />
                <a
                  href="mailto:info@tienda.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  info@tienda.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Beneficios / Garantías */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Truck size={20} className="text-gray-500" />
              <span className="text-sm">Envíos a todo el país</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Shield size={20} className="text-gray-500" />
              <span className="text-sm">Compra 100% segura</span>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Headphones size={20} className="text-gray-500" />
              <span className="text-sm">Soporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-3">
              <CreditCard size={20} className="text-gray-500" />
              <span className="text-xs text-gray-500">Visa • Mastercard • PayPal</span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              © {currentYear} Tu Tienda. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
