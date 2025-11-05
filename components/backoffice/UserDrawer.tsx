'use client';

import { useState } from 'react';
import { X, Edit2, Trash2, Mail, Briefcase, Users, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { User, UserStatus } from '@/types/users';
import { mockUsers, mockTeams } from '@/lib/mockUsers';
import DeleteConfirmationModal from './DeleteConfirmationModal';

type UserDrawerProps = {
  user: User | null;
  onClose: () => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
};

type TabType = 'details' | 'history' | 'books';

const statusLabels: Record<UserStatus, string> = {
  active: 'Ativo',
  pending: 'Pendente',
  inactive: 'Inativo',
};

const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  inactive: 'bg-neutral-2 text-neutral-5',
};

const statusIcons: Record<UserStatus, React.ReactNode> = {
  active: <CheckCircle className="w-4 h-4" />,
  pending: <Clock className="w-4 h-4" />,
  inactive: <XCircle className="w-4 h-4" />,
};

export default function UserDrawer({ user, onClose, onEdit, onDelete }: UserDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!user) return null;

  // Buscar informações adicionais
  const manager = user.manager_id ? mockUsers.find(u => u.id === user.manager_id) : null;
  const team = user.team_id ? mockTeams.find(t => t.id === user.team_id) : null;

  const handleDelete = () => {
    onDelete(user.id);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-2 bg-white">
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-xl text-neutral-10 truncate">
              {user.full_name}
            </h2>
            <p className="text-sm text-neutral-8 font-mono truncate">
              {user.email_prefix}@suno.com.br
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-neutral-8 hover:bg-neutral-1 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-neutral-8 hover:bg-red-50 hover:text-suno-red rounded-lg transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-8 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 border-b border-neutral-2 bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-suno-red border-b-2 border-suno-red'
                : 'text-neutral-8 hover:text-neutral-10'
            }`}
          >
            Detalhes
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'books'
                ? 'text-suno-red border-b-2 border-suno-red'
                : 'text-neutral-8 hover:text-neutral-10'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-suno-red border-b-2 border-suno-red'
                : 'text-neutral-8 hover:text-neutral-10'
            }`}
          >
            Histórico
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-neutral-1">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-white rounded-lg border border-neutral-2 p-5">
                <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-3">
                  Status
                </p>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${statusColors[user.status]}`}>
                    {statusIcons[user.status]}
                    {statusLabels[user.status]}
                  </span>
                  {user.status === 'pending' && (
                    <p className="text-sm text-neutral-8">
                      Aguardando primeiro login
                    </p>
                  )}
                </div>
              </div>

              {/* Informações Básicas */}
              <div className="bg-white rounded-lg border border-neutral-2 p-5">
                <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-4">
                  Informações Básicas
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-neutral-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-5 mb-1">Email</p>
                      <p className="text-sm text-neutral-10 font-mono">
                        {user.full_email || `${user.email_prefix}@suno.com.br`}
                      </p>
                      {user.full_email && user.full_email !== `${user.email_prefix}@suno.com.br` && (
                        <p className="text-xs text-neutral-5 mt-1">
                          Email vinculado após login
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-neutral-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-5 mb-1">Cargo</p>
                      <p className="text-sm text-neutral-10">
                        {user.role === 'admin' ? 'Administrador' : user.role === 'manager' ? 'Gestor' : 'Colaborador'}
                      </p>
                      {user.department && (
                        <p className="text-xs text-neutral-8 mt-1">
                          {user.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-neutral-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-5 mb-1">Cadastrado em</p>
                      <p className="text-sm text-neutral-10">
                        {new Date(user.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hierarquia */}
              {(manager || team) && (
                <div className="bg-white rounded-lg border border-neutral-2 p-5">
                  <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-4">
                    Hierarquia
                  </p>
                  <div className="space-y-4">
                    {manager && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-neutral-5 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-5 mb-1">Manager</p>
                          <p className="text-sm font-medium text-neutral-10">
                            {manager.full_name}
                          </p>
                          <p className="text-xs text-neutral-8 mt-1">
                            {manager.department || 'Sem departamento'}
                          </p>
                        </div>
                      </div>
                    )}

                    {team && (
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-neutral-5 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-neutral-5 mb-1">Time</p>
                          <p className="text-sm font-medium text-neutral-10">
                            {team.name}
                          </p>
                          <p className="text-xs text-neutral-8 mt-1">
                            Manager: {team.manager_name} • {team.member_count} membros
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Books */}
              <div className="bg-white rounded-lg border border-neutral-2 p-5">
                <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-4">
                  Books de Indicadores
                </p>
                {user.has_individual_book ? (
                  <div className="flex items-center gap-3 p-3 bg-neutral-1 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-10">
                        Book Individual
                      </p>
                      <p className="text-xs text-neutral-8 mt-0.5">
                        Usuário possui book de indicadores individual
                      </p>
                    </div>
                  </div>
                ) : team ? (
                  <div className="flex items-center gap-3 p-3 bg-neutral-1 rounded-lg">
                    <Users className="w-5 h-5 text-neutral-8" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-10">
                        Book de Time
                      </p>
                      <p className="text-xs text-neutral-8 mt-0.5">
                        Compartilha book com o time {team.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-suno-red" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-suno-red">
                        Sem Book
                      </p>
                      <p className="text-xs text-neutral-8 mt-0.5">
                        Usuário não possui book de indicadores
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Books Tab */}
          {activeTab === 'books' && (
            <div className="bg-white rounded-lg border border-neutral-2 p-8 text-center">
              <p className="text-neutral-8 mb-2">
                Visualização de books em desenvolvimento
              </p>
              <p className="text-sm text-neutral-5">
                Em breve você poderá ver e gerenciar os books deste usuário
              </p>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-lg border border-neutral-2 p-8 text-center">
              <p className="text-neutral-8 mb-2">
                Histórico de alterações em desenvolvimento
              </p>
              <p className="text-sm text-neutral-5">
                Em breve você poderá ver o histórico completo de alterações
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        description="Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos."
        confirmText="EXCLUIR USUÁRIO"
        itemName={user.full_name}
        warningMessage={
          user.has_individual_book
            ? 'Este usuário possui um book individual que também será excluído.'
            : undefined
        }
      />
    </>
  );
}

