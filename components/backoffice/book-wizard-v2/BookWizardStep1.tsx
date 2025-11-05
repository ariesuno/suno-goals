'use client';

import { useState, useMemo } from 'react';
import { User, Users, Search, Building2 } from 'lucide-react';
import { mockUsers, mockTeams } from '@/lib/mockUsers';
import { BookOwnerType } from '@/types/backoffice';

type BookWizardStep1Props = {
  formData: any;
  setFormData: (data: any) => void;
};

export default function BookWizardStep1({ formData, setFormData }: BookWizardStep1Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar pessoas ou times baseado no tipo selecionado e busca
  const filteredOwners = useMemo(() => {
    if (formData.owner_type === 'person') {
      return mockUsers
        .filter(u => u.role !== 'admin')
        .filter(u => !u.team_id)
        .filter(u => {
          if (!searchTerm) return true;
          const search = searchTerm.toLowerCase();
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
          if (!searchTerm) return true;
          const search = searchTerm.toLowerCase();
          return (
            t.name.toLowerCase().includes(search) ||
            t.manager_name.toLowerCase().includes(search) ||
            (t.department && t.department.toLowerCase().includes(search))
          );
        });
    }
  }, [formData.owner_type, searchTerm]);

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
  };

  return (
    <div className="space-y-6">
      {/* Tipo de Owner - Tabs Style */}
      <div>
        <label className="block text-sm font-semibold text-neutral-10 mb-3">
          Tipo de Book
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-neutral-1 rounded-lg">
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
              setSearchTerm('');
            }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
              formData.owner_type === 'person'
                ? 'bg-white text-suno-red shadow-sm'
                : 'text-neutral-8 hover:text-neutral-10'
            }`}
          >
            <User className="w-4 h-4" />
            Individual
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
              setSearchTerm('');
            }}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
              formData.owner_type === 'team'
                ? 'bg-white text-suno-red shadow-sm'
                : 'text-neutral-8 hover:text-neutral-10'
            }`}
          >
            <Users className="w-4 h-4" />
            Time
          </button>
        </div>
      </div>

      {/* Busca */}
      <div>
        <label className="block text-sm font-semibold text-neutral-10 mb-3">
          {formData.owner_type === 'person' ? 'Buscar Pessoa' : 'Buscar Time'}
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              formData.owner_type === 'person'
                ? 'Digite o nome, email ou departamento...'
                : 'Digite o nome do time ou manager...'
            }
            className="w-full pl-12 pr-4 py-3 border-2 border-neutral-3 rounded-lg focus:outline-none focus:border-suno-red transition-colors"
          />
        </div>
      </div>

      {/* Lista de Owners - Scrollable dentro do step */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-neutral-10">
            Selecione {formData.owner_type === 'person' ? 'uma pessoa' : 'um time'}
          </label>
          <span className="text-xs text-neutral-5">
            {filteredOwners.length} {filteredOwners.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 -mr-2">
          {filteredOwners.length === 0 ? (
            <div className="text-center py-12 text-neutral-5">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum resultado encontrado</p>
            </div>
          ) : (
            filteredOwners.map((owner: any) => {
              const isSelected = formData.owner_id === owner.id;

              return (
                <button
                  key={owner.id}
                  type="button"
                  onClick={() => handleSelectOwner(owner)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-suno-red bg-red-50'
                      : 'border-neutral-2 bg-white hover:border-neutral-3 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-suno-red text-white' : 'bg-neutral-2 text-neutral-8'
                      }`}
                    >
                      {formData.owner_type === 'person' ? (
                        <User className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold truncate ${
                          isSelected ? 'text-suno-red' : 'text-neutral-10'
                        }`}
                      >
                        {formData.owner_type === 'person' ? owner.full_name : owner.name}
                      </p>

                      {formData.owner_type === 'person' ? (
                        <>
                          {owner.department && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <Building2 className="w-3.5 h-3.5 text-neutral-5" />
                              <p className="text-sm text-neutral-8 truncate">{owner.department}</p>
                            </div>
                          )}
                          <p className="text-xs text-neutral-5 font-mono mt-1 truncate">
                            {owner.email_prefix}@suno.com.br
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-neutral-8 mt-1">Manager: {owner.manager_name}</p>
                          <p className="text-xs text-neutral-5 mt-1">
                            {owner.member_count} {owner.member_count === 1 ? 'membro' : 'membros'}
                            {owner.department && ` • ${owner.department}`}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Checkmark */}
                    {isSelected && (
                      <div className="w-6 h-6 bg-suno-red rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Informações do Book - Só aparece após selecionar owner */}
      {formData.owner_id && (
        <div className="pt-6 border-t border-neutral-2 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-10 mb-2">
              Nome do Book
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Book Allan Silva - 2025"
              className="w-full px-4 py-3 border-2 border-neutral-3 rounded-lg focus:outline-none focus:border-suno-red transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-10 mb-2">Ano</label>
            <select
              value={formData.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year: parseInt(e.target.value),
                  name: formData.name.replace(/\d{4}$/, e.target.value),
                })
              }
              className="w-full px-4 py-3 border-2 border-neutral-3 rounded-lg focus:outline-none focus:border-suno-red transition-colors"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-10 mb-2">
              Descrição <span className="text-neutral-5 font-normal">(opcional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Adicione observações sobre este book..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-neutral-3 rounded-lg focus:outline-none focus:border-suno-red transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

