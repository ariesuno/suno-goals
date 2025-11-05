'use client';

import { useState, useMemo } from 'react';
import { User, Users, Search } from 'lucide-react';
import { mockUsers, mockTeams } from '@/lib/mockUsers';
import { BookOwnerType } from '@/types/backoffice';

type BookStep1InfoProps = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookStep1Info({ formData, setFormData }: BookStep1InfoProps) {
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  // Filtrar pessoas ou times baseado no tipo selecionado e busca
  const filteredOwners = useMemo(() => {
    if (formData.owner_type === 'person') {
      return mockUsers
        .filter(u => u.role !== 'admin') // Admins não recebem books
        .filter(u => !u.team_id) // Pessoas em times não podem ter book individual
        .filter(u => {
          if (!ownerSearchTerm) return true;
          const search = ownerSearchTerm.toLowerCase();
          return (
            u.full_name.toLowerCase().includes(search) ||
            u.email_prefix.toLowerCase().includes(search) ||
            (u.department && u.department.toLowerCase().includes(search))
          );
        });
    } else {
      return mockTeams
        .filter(t => t.is_active)
        .filter(t => {
          if (!ownerSearchTerm) return true;
          const search = ownerSearchTerm.toLowerCase();
          return (
            t.name.toLowerCase().includes(search) ||
            t.manager_name.toLowerCase().includes(search) ||
            (t.department && t.department.toLowerCase().includes(search))
          );
        });
    }
  }, [formData.owner_type, ownerSearchTerm]);

  const handleSelectOwner = (owner: any) => {
    if (formData.owner_type === 'person') {
      setFormData({
        ...formData,
        owner_id: owner.id,
        owner_name: owner.full_name,
        owner_email: owner.email_prefix + '@suno.com.br',
        owner_role: owner.department,
        name: `Book ${owner.full_name} - ${formData.year}`,
      });
    } else {
      setFormData({
        ...formData,
        owner_id: owner.id,
        owner_name: owner.name,
        owner_role: owner.department,
        name: `Book ${owner.name} - ${formData.year}`,
      });
    }
    setShowOwnerDropdown(false);
    setOwnerSearchTerm('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-neutral-2 p-8">
        <div className="mb-6">
          <h2 className="font-display font-bold text-xl text-neutral-10 mb-2">
            Informações Básicas
          </h2>
          <p className="text-sm text-neutral-8">
            Defina o responsável pelo book e informações gerais
          </p>
        </div>

        <div className="space-y-6">
          {/* Tipo de Owner */}
          <div>
            <label className="block text-sm font-medium text-neutral-10 mb-3">
              Atribuir book para: <span className="text-suno-red">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    owner_type: 'person',
                    owner_id: '',
                    owner_name: '',
                    owner_email: undefined,
                    owner_role: undefined,
                  });
                  setOwnerSearchTerm('');
                  setShowOwnerDropdown(false);
                }}
                className={`flex flex-col items-center gap-3 px-6 py-8 border-2 rounded-xl font-medium transition-all ${
                  formData.owner_type === 'person'
                    ? 'border-suno-red bg-red-50 text-suno-red shadow-sm'
                    : 'border-neutral-3 text-neutral-8 hover:border-neutral-5 hover:shadow-sm'
                }`}
              >
                <User className="w-8 h-8" />
                <span className="text-lg">Pessoa</span>
                <span className="text-xs text-neutral-5">Book individual</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    owner_type: 'team',
                    owner_id: '',
                    owner_name: '',
                    owner_email: undefined,
                    owner_role: undefined,
                  });
                  setOwnerSearchTerm('');
                  setShowOwnerDropdown(false);
                }}
                className={`flex flex-col items-center gap-3 px-6 py-8 border-2 rounded-xl font-medium transition-all ${
                  formData.owner_type === 'team'
                    ? 'border-suno-red bg-red-50 text-suno-red shadow-sm'
                    : 'border-neutral-3 text-neutral-8 hover:border-neutral-5 hover:shadow-sm'
                }`}
              >
                <Users className="w-8 h-8" />
                <span className="text-lg">Time</span>
                <span className="text-xs text-neutral-5">Book compartilhado</span>
              </button>
            </div>
          </div>

          {/* Seletor de Owner */}
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-10 mb-3">
              {formData.owner_type === 'person' ? 'Selecionar Pessoa' : 'Selecionar Time'}{' '}
              <span className="text-suno-red">*</span>
            </label>

            {/* Owner Selecionado (Preview) */}
            {formData.owner_id && formData.owner_name ? (
              <div className="p-6 bg-neutral-1 border-2 border-neutral-2 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-2 rounded-full flex items-center justify-center">
                      {formData.owner_type === 'person' ? (
                        <User className="w-8 h-8 text-neutral-8" />
                      ) : (
                        <Users className="w-8 h-8 text-neutral-8" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-neutral-10">{formData.owner_name}</p>
                      {formData.owner_role && (
                        <p className="text-sm text-neutral-8 mt-1">{formData.owner_role}</p>
                      )}
                      {formData.owner_email && (
                        <p className="text-xs text-neutral-5 font-mono mt-1">{formData.owner_email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        owner_id: '',
                        owner_name: '',
                        owner_email: undefined,
                        owner_role: undefined,
                      });
                      setShowOwnerDropdown(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-suno-red hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                className="w-full px-6 py-4 border-2 border-neutral-3 rounded-xl text-left text-neutral-5 hover:border-neutral-5 transition-all flex items-center justify-between group"
              >
                <span>
                  {formData.owner_type === 'person'
                    ? 'Clique para selecionar uma pessoa...'
                    : 'Clique para selecionar um time...'}
                </span>
                <Search className="w-5 h-5 group-hover:text-neutral-8 transition-colors" />
              </button>
            )}

            {/* Dropdown com busca */}
            {showOwnerDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-neutral-3 rounded-xl shadow-xl max-h-96 overflow-hidden flex flex-col">
                {/* Campo de busca */}
                <div className="p-4 border-b border-neutral-2 bg-neutral-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-5" />
                    <input
                      type="text"
                      value={ownerSearchTerm}
                      onChange={(e) => setOwnerSearchTerm(e.target.value)}
                      placeholder={
                        formData.owner_type === 'person'
                          ? 'Buscar por nome, email ou departamento...'
                          : 'Buscar por nome, manager ou departamento...'
                      }
                      className="w-full pl-12 pr-4 py-3 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Lista de opções */}
                <div className="overflow-y-auto flex-1">
                  {filteredOwners.length === 0 ? (
                    <div className="p-8 text-center text-sm text-neutral-5">
                      {formData.owner_type === 'person' ? 'Nenhuma pessoa encontrada' : 'Nenhum time encontrado'}
                    </div>
                  ) : (
                    filteredOwners.map((owner: any) => (
                      <button
                        key={owner.id}
                        type="button"
                        onClick={() => handleSelectOwner(owner)}
                        className="w-full p-4 hover:bg-neutral-1 transition-colors text-left border-b border-neutral-1 last:border-b-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-2 rounded-full flex items-center justify-center flex-shrink-0">
                            {formData.owner_type === 'person' ? (
                              <User className="w-6 h-6 text-neutral-8" />
                            ) : (
                              <Users className="w-6 h-6 text-neutral-8" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-10 truncate">
                              {formData.owner_type === 'person' ? owner.full_name : owner.name}
                            </p>
                            {formData.owner_type === 'person' ? (
                              <>
                                {owner.department && (
                                  <p className="text-sm text-neutral-8 truncate">{owner.department}</p>
                                )}
                                <p className="text-xs text-neutral-5 font-mono truncate">
                                  {owner.email_prefix}@suno.com.br
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm text-neutral-8 truncate">Manager: {owner.manager_name}</p>
                                <p className="text-xs text-neutral-5">
                                  {owner.member_count} {owner.member_count === 1 ? 'membro' : 'membros'}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Botão para fechar */}
                <div className="p-3 border-t border-neutral-2 bg-neutral-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOwnerDropdown(false);
                      setOwnerSearchTerm('');
                    }}
                    className="w-full px-4 py-2 text-sm text-neutral-8 hover:bg-neutral-2 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Nome do Book */}
          <div>
            <label className="block text-sm font-medium text-neutral-10 mb-3">
              Nome do Book <span className="text-suno-red">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Book Allan Silva - 2025"
              className="w-full px-4 py-3 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
            />
            <p className="text-xs text-neutral-5 mt-2">
              O nome é gerado automaticamente, mas você pode personalizá-lo
            </p>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-sm font-medium text-neutral-10 mb-3">
              Ano <span className="text-suno-red">*</span>
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-neutral-10 mb-3">Descrição (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Adicione uma descrição ou observações sobre este book..."
              rows={4}
              className="w-full px-4 py-3 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

