/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  User,
  Store,
  Ban,
  CheckCircle,
  MoreVertical,
  ShieldCheck,
  UserX,
  RefreshCw,
  Mail,
  Calendar,
} from 'lucide-react';
import { AdminUserView, Role } from '@/lib/types/type-models';
import { changeUserRole } from '@/actions/admin/usuarios/get-users.action';
import { toggleUserBlock } from '@/actions/admin/usuarios/toggle-blocked.action';
import { useToast } from '@/components/ui/custom-toast';

type Props = {
  initialUsers: AdminUserView[];
};

export default function AdminUserClient({ initialUsers }: Props) {
  const toast = useToast();

  //console.log('USUARIOS ===', initialUsers);

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'seller' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const itemsPerPage = 5;

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' ? true : user.role.toLowerCase() === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ? true : statusFilter === 'active' ? !user.isBlocked : user.isBlocked;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return {
          icon: ShieldCheck,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          label: 'Administrador',
        };
      case Role.SELLER:
        return { icon: Store, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Vendedor' };
      default:
        return { icon: User, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Usuario' };
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'USER' | 'SELLER') => {
    const res = await changeUserRole(userId, newRole);
    if (!res.success) {
      setMessage({ type: 'error', text: res.message });
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, role: newRole === 'SELLER' ? Role.SELLER : Role.USER }
          : user,
      ),
    );
    toast.success(`Rol actualizado a ${newRole === 'SELLER' ? 'Vendedor' : 'Usuario'}`);
  };

  const handleToggleBlock = async (userId: string) => {
    const res = await toggleUserBlock(userId);

    if (!res.success) {
      //setMessage({ type: 'error', text: res.message });
      toast.error(res.message);
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user)),
    );

    toast.success('Estado de bloqueo actualizado');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-sm text-gray-500">
              {users.length} usuario{users.length !== 1 ? 's' : ''} registrado
              {users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Usuarios</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter((u) => u.role.toLowerCase() === 'user').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Store className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Vendedores</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter((u) => u.role.toLowerCase() === 'seller').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Administradores</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter((u) => u.role.toLowerCase() === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <Ban className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Bloqueados</p>
              <p className="text-xl font-bold text-gray-900">
                {users.filter((u) => u.isBlocked).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Message banner */}
      {message && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <CheckCircle className="w-4 h-4 shrink-0" />
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">Todos los roles</option>
              <option value="user">Usuarios</option>
              <option value="seller">Vendedores</option>
              <option value="admin">Administradores</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="blocked">Bloqueados</option>
            </select>
            {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">Sin usuarios aún</p>
            <p className="text-gray-400 text-sm">No hay usuarios registrados en la plataforma</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Filter className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">No hay resultados</p>
            <p className="text-gray-400 text-sm">
              No se encontraron usuarios con los filtros aplicados
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Registro
                    </th>
                    {/*
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Órdenes
                    </th>
                    */}
                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.map((user) => {
                    const roleInfo = getRoleIcon(user.role);
                    const RoleIcon = roleInfo.icon;

                    return (
                      <tr key={user.id} className="hover:bg-gray-50/60 transition-colors group">
                        {/* User info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="w-full h-full rounded-xl object-cover"
                                />
                              ) : (
                                <span className="text-blue-700 font-semibold text-sm">
                                  {getInitials(user.name)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${roleInfo.bg} ${roleInfo.color} text-xs font-medium rounded-lg`}
                          >
                            <RoleIcon className="w-3.5 h-3.5" />
                            {roleInfo.label}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {user.isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-200">
                              <Ban className="w-3.5 h-3.5" />
                              Bloqueado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Activo
                            </span>
                          )}
                        </td>

                        {/* Registration date */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600 text-xs">
                              {formatDate(user.createdAt.toString())}
                            </span>
                          </div>
                        </td>

                        {/* Orders count 
                        
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{user.totalOrders}</span>
                        </td>
                        
                        */}

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowActionMenu(showActionMenu === user.id ? null : user.id)
                              }
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>

                            {showActionMenu === user.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setShowActionMenu(null)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20">
                                  <div className="px-3 py-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-gray-400">ACCIONES</p>
                                  </div>

                                  {user.role.toLowerCase() !== 'admin' && (
                                    <>
                                      {user.role.toLowerCase() === 'user' ? (
                                        <button
                                          onClick={() => handleChangeRole(user.id, 'SELLER')}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          <Shield className="w-4 h-4 text-emerald-600" />
                                          Cambiar a Vendedor
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleChangeRole(user.id, 'USER')}
                                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                          <User className="w-4 h-4 text-blue-600" />
                                          Cambiar a Usuario
                                        </button>
                                      )}

                                      <button
                                        onClick={() => handleToggleBlock(user.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        {user.isBlocked ? (
                                          <>
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            Desbloquear usuario
                                          </>
                                        ) : (
                                          <>
                                            <UserX className="w-4 h-4 text-red-600" />
                                            Bloquear usuario
                                          </>
                                        )}
                                      </button>
                                    </>
                                  )}

                                  {user.role.toLowerCase() === 'admin' && (
                                    <div className="px-4 py-2 text-xs text-gray-400 italic">
                                      No se pueden modificar administradores
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl font-semibold text-sm transition-all ${
                        currentPage === page
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
