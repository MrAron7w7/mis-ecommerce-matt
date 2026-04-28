'use client';

import {
  Users,
  Store,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo (después conectar con API real)
  const stats = {
    totalUsers: 1248,
    totalSellers: 156,
    totalProducts: 3420,
    usersGrowth: 12.5,
    sellersGrowth: 8.3,
    productsGrowth: -2.1,
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PE').format(num);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value > 0;
    return {
      text: `${isPositive ? '+' : ''}${value}%`,
      color: isPositive ? 'text-emerald-600' : 'text-red-600',
      icon: isPositive ? TrendingUp : TrendingDown,
    };
  };

  const usersGrowth = formatPercentage(stats.usersGrowth);
  const sellersGrowth = formatPercentage(stats.sellersGrowth);
  const productsGrowth = formatPercentage(stats.productsGrowth);

  const metrics = [
    {
      title: 'Total usuarios',
      value: formatNumber(stats.totalUsers),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      growth: usersGrowth,
    },
    {
      title: 'Total vendedores',
      value: formatNumber(stats.totalSellers),
      icon: Store,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      growth: sellersGrowth,
    },
    {
      title: 'Productos publicados',
      value: formatNumber(stats.totalProducts),
      icon: Package,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      growth: productsGrowth,
    },
  ];

  // Actividad reciente (ejemplo)
  const recentActivity = [
    {
      id: 1,
      type: 'new_user',
      title: 'Nuevo usuario registrado',
      description: 'María González se unió a la plataforma',
      time: 'Hace 5 minutos',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      type: 'new_seller',
      title: 'Nuevo vendedor',
      description: 'ElectroTech se registró como vendedor',
      time: 'Hace 1 hora',
      icon: Store,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      id: 3,
      type: 'new_product',
      title: 'Producto publicado',
      description: 'Se publicó "Smartphone XYZ"',
      time: 'Hace 3 horas',
      icon: Package,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 4,
      type: 'sale',
      title: 'Nueva venta',
      description: 'Venta por S/ 1,299.00 completada',
      time: 'Hace 5 horas',
      icon: DollarSign,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen general de la plataforma</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">Última actualización: hoy</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric, index) => {
          const GrowthIcon = metric.growth.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 ${metric.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold flex items-center gap-1 ${metric.growth.color}`}
                  >
                    <GrowthIcon className="w-3.5 h-3.5" />
                    {metric.growth.text}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two column layout for recent activity and quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Recent Activity - takes 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-gray-500" />
                </div>
                <h2 className="font-semibold text-gray-900">Actividad reciente</h2>
              </div>
              <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                Ver todas
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 ${activity.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <ActivityIcon className={`w-4 h-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1.5">{activity.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
