// =====================================================================================================================
// TYPES PARA GESTÃO DE USUÁRIOS E TIMES
// =====================================================================================================================

export type UserRole = 'admin' | 'manager' | 'employee';

export type UserStatus = 'pending' | 'active' | 'inactive';

export type User = {
  id: string;
  email_prefix: string; // Parte antes do @ (ex: "arie.perini")
  full_email?: string; // Email completo após primeiro login (ex: "arie.perini@suno.com.br")
  first_name: string;
  last_name: string;
  full_name: string; // Concatenação de first_name + last_name
  role: UserRole;
  department?: string;
  status: UserStatus; // pending = não fez login ainda, active = já logou, inactive = desativado
  team_id?: string; // Se faz parte de um time
  team_name?: string; // Nome do time (para exibição)
  manager_id?: string; // Manager direto (se não faz parte de time)
  manager_name?: string; // Nome do manager (para exibição)
  has_individual_book: boolean; // Se pode ter book individual (false se está em time)
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  manager_id: string; // Líder do time
  manager_name: string;
  department?: string;
  members: TeamMember[];
  member_count: number;
  is_active: boolean;
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
};

export type TeamMember = {
  user_id: string;
  user_name: string;
  user_email_prefix: string;
  role_in_team?: string; // Ex: "Tech Lead", "Developer", etc (opcional)
  joined_at: Date;
};

export type UserFilters = {
  search?: string;
  role?: UserRole[];
  status?: UserStatus[];
  department?: string[];
  has_team?: boolean; // true = apenas com time, false = apenas sem time
  has_individual_book?: boolean;
};

export type TeamFilters = {
  search?: string;
  department?: string[];
  manager_id?: string;
  is_active?: boolean;
  min_members?: number;
  max_members?: number;
};

export type UserFormData = {
  first_name: string;
  last_name: string;
  email_prefix: string;
  role: UserRole;
  department?: string;
  manager_id?: string;
  team_id?: string;
};

export type TeamFormData = {
  name: string;
  description?: string;
  manager_id: string;
  department?: string;
  member_ids: string[]; // IDs dos usuários que farão parte do time
};

// Helper para gerar email completo
export const generateFullEmail = (emailPrefix: string, domain: string = 'suno.com.br'): string => {
  return `${emailPrefix}@${domain}`;
};

// Helper para validar email prefix
export const isValidEmailPrefix = (prefix: string): boolean => {
  // Apenas letras minúsculas, números, pontos e hífens
  const regex = /^[a-z0-9.-]+$/;
  return regex.test(prefix);
};

// Helper para formatar nome completo
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// Labels para roles
export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gestor',
  employee: 'Colaborador',
};

// Labels para status
export const statusLabels: Record<UserStatus, string> = {
  pending: 'Aguardando Primeiro Login',
  active: 'Ativo',
  inactive: 'Inativo',
};

// Cores para status
export const statusColors: Record<UserStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  active: { bg: 'bg-neutral-1', text: 'text-neutral-10' },
  inactive: { bg: 'bg-neutral-2', text: 'text-neutral-5' },
};

