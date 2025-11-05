'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { User, UserFormData, UserRole, isValidEmailPrefix, formatFullName, generateFullEmail } from '@/types/users';
import { mockUsers, mockTeams } from '@/lib/mockUsers';

type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormData) => void;
  user?: User; // Se fornecido, é edição
};

const departments = [
  'FP&A',
  'Tecnologia',
  'Dados e CRM',
  'Produtos',
  'Comercial',
  'Compliance',
  'Marketing',
  'Vendas',
  'Atendimento',
  'Financeiro',
  'Jurídico',
  'C&D',
];

export default function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email_prefix: user?.email_prefix || '',
    role: user?.role || 'employee',
    department: user?.department || '',
    manager_id: user?.manager_id || '',
    team_id: user?.team_id || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserFormData, boolean>>>({});

  // Managers disponíveis (admins e managers)
  const availableManagers = mockUsers.filter(u => 
    (u.role === 'admin' || u.role === 'manager') && u.id !== user?.id
  );

  // Times disponíveis
  const availableTeams = mockTeams.filter(t => t.is_active);

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Limpar erro ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Regras especiais
    if (field === 'team_id') {
      // Se selecionou um time, limpar manager individual
      if (value) {
        setFormData(prev => ({ ...prev, manager_id: '' }));
      }
    }

    if (field === 'manager_id') {
      // Se selecionou um manager, limpar time
      if (value) {
        setFormData(prev => ({ ...prev, team_id: '' }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserFormData, string>> = {};

    // Nome
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Nome é obrigatório';
    }

    // Sobrenome
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Sobrenome é obrigatório';
    }

    // Email prefix
    if (!formData.email_prefix.trim()) {
      newErrors.email_prefix = 'Email é obrigatório';
    } else if (!isValidEmailPrefix(formData.email_prefix)) {
      newErrors.email_prefix = 'Use apenas letras minúsculas, números, pontos e hífens';
    } else {
      // Verificar se já existe (exceto se for edição do mesmo usuário)
      const exists = mockUsers.some(u => 
        u.email_prefix === formData.email_prefix && u.id !== user?.id
      );
      if (exists) {
        newErrors.email_prefix = 'Este email já está cadastrado';
      }
    }

    // Role
    if (!formData.role) {
      newErrors.role = 'Cargo é obrigatório';
    }

    // Manager ou Time (pelo menos um para employees)
    if (formData.role === 'employee' && !formData.manager_id && !formData.team_id) {
      newErrors.manager_id = 'Selecione um manager ou time';
      newErrors.team_id = 'Selecione um manager ou time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos como touched
    setTouched({
      first_name: true,
      last_name: true,
      email_prefix: true,
      role: true,
      department: true,
      manager_id: true,
      team_id: true,
    });

    if (validate()) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email_prefix: '',
      role: 'employee',
      department: '',
      manager_id: '',
      team_id: '',
    });
    setErrors({});
    setTouched({});
    onClose();
  };

  if (!isOpen) return null;

  const fullName = formatFullName(formData.first_name, formData.last_name);
  const previewEmail = formData.email_prefix ? generateFullEmail(formData.email_prefix) : '';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-2">
            <div>
              <h2 className="font-display font-bold text-xl text-neutral-10">
                {user ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <p className="text-sm text-neutral-5 mt-1">
                {user ? 'Atualize as informações do usuário' : 'Preencha os dados para criar um novo usuário'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-8" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
              {/* Preview */}
              {(formData.first_name || formData.last_name || formData.email_prefix) && (
                <div className="p-4 bg-neutral-1 rounded-lg border border-neutral-2">
                  <p className="text-xs font-medium text-neutral-5 uppercase tracking-wide mb-2">
                    Preview
                  </p>
                  {fullName && (
                    <p className="font-medium text-neutral-10">
                      {fullName}
                    </p>
                  )}
                  {previewEmail && (
                    <p className="text-sm text-neutral-8 font-mono">
                      {previewEmail}
                    </p>
                  )}
                </div>
              )}

              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Nome <span className="text-suno-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    placeholder="Ex: Ariê"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.first_name && errors.first_name
                        ? 'border-suno-red focus:ring-red-200'
                        : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                    }`}
                  />
                  {touched.first_name && errors.first_name && (
                    <p className="text-xs text-suno-red mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Sobrenome <span className="text-suno-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    placeholder="Ex: Perini"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.last_name && errors.last_name
                        ? 'border-suno-red focus:ring-red-200'
                        : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                    }`}
                  />
                  {touched.last_name && errors.last_name && (
                    <p className="text-xs text-suno-red mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Prefix */}
              <div>
                <label className="block text-sm font-medium text-neutral-10 mb-2">
                  Email (antes do @) <span className="text-suno-red">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.email_prefix}
                    onChange={(e) => handleChange('email_prefix', e.target.value.toLowerCase())}
                    placeholder="Ex: arie.perini"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors font-mono ${
                      touched.email_prefix && errors.email_prefix
                        ? 'border-suno-red focus:ring-red-200'
                        : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                    }`}
                  />
                  <span className="text-neutral-8 font-mono">@suno.com.br</span>
                </div>
                <p className="text-xs text-neutral-5 mt-1">
                  Use apenas letras minúsculas, números, pontos e hífens
                </p>
                {touched.email_prefix && errors.email_prefix && (
                  <p className="text-xs text-suno-red mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email_prefix}
                  </p>
                )}
              </div>

              {/* Cargo e Departamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Cargo <span className="text-suno-red">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value as UserRole)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.role && errors.role
                        ? 'border-suno-red focus:ring-red-200'
                        : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                    }`}
                  >
                    <option value="employee">Colaborador</option>
                    <option value="manager">Gestor</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {touched.role && errors.role && (
                    <p className="text-xs text-suno-red mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.role}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-10 mb-2">
                    Departamento
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-suno-red focus:border-suno-red"
                  >
                    <option value="">Selecione...</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Manager ou Time */}
              {formData.role === 'employee' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-3">
                    ⚠️ Colaboradores devem ter um Manager OU fazer parte de um Time
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-10 mb-2">
                        Manager
                      </label>
                      <select
                        value={formData.manager_id}
                        onChange={(e) => handleChange('manager_id', e.target.value)}
                        disabled={!!formData.team_id}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formData.team_id
                            ? 'bg-neutral-1 text-neutral-5 cursor-not-allowed'
                            : touched.manager_id && errors.manager_id
                            ? 'border-suno-red focus:ring-red-200'
                            : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                        }`}
                      >
                        <option value="">Selecione...</option>
                        {availableManagers.map(manager => (
                          <option key={manager.id} value={manager.id}>
                            {manager.full_name} ({manager.role === 'admin' ? 'Admin' : 'Manager'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-10 mb-2">
                        Time
                      </label>
                      <select
                        value={formData.team_id}
                        onChange={(e) => handleChange('team_id', e.target.value)}
                        disabled={!!formData.manager_id}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          formData.manager_id
                            ? 'bg-neutral-1 text-neutral-5 cursor-not-allowed'
                            : touched.team_id && errors.team_id
                            ? 'border-suno-red focus:ring-red-200'
                            : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                        }`}
                      >
                        <option value="">Selecione...</option>
                        {availableTeams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {touched.manager_id && touched.team_id && (errors.manager_id || errors.team_id) && (
                    <p className="text-xs text-suno-red mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.manager_id || errors.team_id}
                    </p>
                  )}

                  {formData.team_id && (
                    <p className="text-xs text-neutral-8 mt-2">
                      ℹ️ Usuários em times não podem ter books individuais
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-2 bg-neutral-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-neutral-10 hover:bg-neutral-2 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-suno-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              {user ? 'Salvar Alterações' : 'Criar Usuário'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

