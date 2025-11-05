'use client';

import { useState } from 'react';
import { Plus, Search, Filter, X, Users as UsersIcon, User as UserIcon } from 'lucide-react';
import { mockUsers } from '@/lib/mockUsers';
import { User, UserFilters, UserFormData } from '@/types/users';
import UserFormModal from '@/components/backoffice/UserFormModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UserFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'with_team' | 'without_team' | 'pending'>('all');
  const [showUserModal, setShowUserModal] = useState(false);

  const handleSaveUser = (userData: UserFormData) => {
    // TODO: Integrar com Supabase
    console.log('Saving user:', userData);
    // Por enquanto, apenas fechar o modal
    setShowUserModal(false);
  };

  // Filtrar usuários
  const filteredUsers = users.filter(user => {
    // Busca
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (
        !user.full_name.toLowerCase().includes(search) &&
        !user.email_prefix.toLowerCase().includes(search) &&
        !user.department?.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    // Filtro por tab
    if (selectedTab === 'with_team' && !user.team_id) return false;
    if (selectedTab === 'without_team' && user.team_id) return false;
    if (selectedTab === 'pending' && user.status !== 'pending') return false;

    // Filtros avançados
    if (filters.role && filters.role.length > 0 && !filters.role.includes(user.role)) {
      return false;
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(user.status)) {
      return false;
    }

    if (filters.has_team !== undefined) {
      const hasTeam = !!user.team_id;
      if (filters.has_team !== hasTeam) return false;
    }

    return true;
  });

  const stats = {
    total: users.length,
    with_team: users.filter(u => u.team_id).length,
    without_team: users.filter(u => !u.team_id).length,
    pending: users.filter(u => u.status === 'pending').length,
  };

  const activeFiltersCount =
    (filters.role?.length || 0) +
    (filters.status?.length || 0) +
    (filters.has_team !== undefined ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-1">
            Usuários
          </h1>
          <p className="text-sm text-neutral-8">
            {filteredUsers.length} de {users.length} usuários
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-suno-red text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-2 overflow-x-auto">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTab === 'all'
              ? 'text-suno-red border-b-2 border-suno-red'
              : 'text-neutral-8 hover:text-neutral-10'
          }`}
        >
          Todos ({stats.total})
        </button>
        <button
          onClick={() => setSelectedTab('with_team')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTab === 'with_team'
              ? 'text-suno-red border-b-2 border-suno-red'
              : 'text-neutral-8 hover:text-neutral-10'
          }`}
        >
          Em Times ({stats.with_team})
        </button>
        <button
          onClick={() => setSelectedTab('without_team')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTab === 'without_team'
              ? 'text-suno-red border-b-2 border-suno-red'
              : 'text-neutral-8 hover:text-neutral-10'
          }`}
        >
          Individuais ({stats.without_team})
        </button>
        <button
          onClick={() => setSelectedTab('pending')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
            selectedTab === 'pending'
              ? 'text-suno-red border-b-2 border-suno-red'
              : 'text-neutral-8 hover:text-neutral-10'
          }`}
        >
          Pendentes ({stats.pending})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-5" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 hover:text-neutral-10"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium text-sm transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'border-suno-red bg-red-50 text-suno-red'
              : 'border-neutral-3 bg-white text-neutral-10 hover:border-neutral-5'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 bg-suno-red text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-neutral-2 rounded-xl p-12 text-center">
          <p className="text-neutral-8 mb-2">Nenhum usuário encontrado</p>
          <p className="text-sm text-neutral-5">
            {searchTerm || activeFiltersCount > 0
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro usuário para começar'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-2 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-1 border-b border-neutral-2">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Usuário
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Cargo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Departamento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Time/Manager
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-8 uppercase tracking-wide">
                    Book
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-2">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-neutral-1 cursor-pointer transition-colors"
                    onClick={() => {/* TODO: Abrir drawer de detalhes */}}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-2 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-neutral-8" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-neutral-10">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-neutral-5">
                            {user.role === 'admin' && 'Administrador'}
                            {user.role === 'manager' && 'Gestor'}
                            {user.role === 'employee' && 'Colaborador'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-10 font-mono">
                        {user.full_email || `${user.email_prefix}@suno.com.br`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-10">
                        {user.role === 'admin' && 'Admin'}
                        {user.role === 'manager' && 'Manager'}
                        {user.role === 'employee' && 'Employee'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-neutral-10">
                        {user.department || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {user.team_id ? (
                        <div className="flex items-center gap-1.5 text-sm text-neutral-10">
                          <UsersIcon className="w-4 h-4 text-neutral-5" />
                          {user.team_name}
                        </div>
                      ) : user.manager_name ? (
                        <div className="flex items-center gap-1.5 text-sm text-neutral-8">
                          <UserIcon className="w-4 h-4 text-neutral-5" />
                          {user.manager_name}
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-5">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-neutral-1 text-neutral-10'
                            : user.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-neutral-2 text-neutral-5'
                        }`}
                      >
                        {user.status === 'active' && 'Ativo'}
                        {user.status === 'pending' && 'Pendente'}
                        {user.status === 'inactive' && 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.has_individual_book ? (
                        <span className="text-sm text-neutral-10">Individual</span>
                      ) : (
                        <span className="text-sm text-neutral-5">Time</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Criar/Editar Usuário */}
      <UserFormModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
