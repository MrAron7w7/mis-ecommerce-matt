import { Clock, RefreshCw, Shield, Truck } from 'lucide-react';

export default function BenefitsBar() {
  const benefits = [
    { icon: Truck, title: 'Envío gratis', description: 'En compras mayores a $50' },
    { icon: Shield, title: 'Compra segura', description: 'Protegemos tus datos' },
    { icon: RefreshCw, title: '30 días', description: 'Devoluciones fáciles' },
    { icon: Clock, title: '24/7 Soporte', description: 'Atención al cliente' },
  ];

  return (
    <div className="bg-gray-50 border-y border-gray-200 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <benefit.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">{benefit.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
