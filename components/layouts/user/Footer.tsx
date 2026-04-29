// components/footer/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, CreditCard, Truck, Shield, Headphones } from 'lucide-react';

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
              <Image src="/img/inicio/logo.png" alt="Logo" width={100} height={33} />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Tu tienda online de confianza. Encuentra todo lo que necesitas con los mejores precios
              y envíos rápidos.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02"
                  />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                  />
                </svg>
              </a>

              {/* 
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
              <a href="#" className="hover:text-white transition">
                <User size={18} />
              </a>
              */}
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
                <Link href="/tiendas" className="hover:text-white transition">
                  Tiendas
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Inicio
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
                <MapPin size={16} className="mt-0.5 shrink-0" />
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
              <span className="text-xs text-gray-500">Yape • Plin</span>
            </div>
            <p className="text-xs text-gray-500 text-center">
              © {currentYear} Matt Innova Solution. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
