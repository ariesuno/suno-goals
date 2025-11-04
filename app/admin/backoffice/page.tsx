import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default async function BackofficeDashboard() {
  // 🚧 DESENVOLVIMENTO: Mock user
  const user = {
    full_name: 'Admin FP&A',
    email: 'admin@suno.com.br',
  };

  // TODO: Fetch real data from Supabase
  const stats = {
    totalUsers: 24,
    totalIndicators: 156,
    totalBooks: 24,
    outdatedBooks: 3,
    achievingIndicators: 98,
    notAchievingIndicators: 58,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-neutral-10 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-8">
          Bem-vindo, <span className="font-semibold">{user?.full_name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-neutral-2 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-neutral-8" />
            </div>
            <span className="text-xs font-medium text-neutral-5">Total</span>
          </div>
          <div className="text-2xl font-bold text-neutral-10 mb-1">
            {stats.totalUsers}
          </div>
          <div className="text-sm text-neutral-8">Usuários</div>
        </div>

        {/* Total Indicators */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-neutral-2 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-neutral-8" />
            </div>
            <span className="text-xs font-medium text-neutral-5">Total</span>
          </div>
          <div className="text-2xl font-bold text-neutral-10 mb-1">
            {stats.totalIndicators}
          </div>
          <div className="text-sm text-neutral-8">Indicadores</div>
        </div>

        {/* Total Books */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-neutral-2 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-neutral-8" />
            </div>
            <span className="text-xs font-medium text-neutral-5">Total</span>
          </div>
          <div className="text-2xl font-bold text-neutral-10 mb-1">
            {stats.totalBooks}
          </div>
          <div className="text-sm text-neutral-8">Books</div>
        </div>

        {/* Achieving Indicators */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-neutral-2 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-neutral-8" />
            </div>
            <span className="text-xs font-medium text-neutral-8">
              {Math.round((stats.achievingIndicators / stats.totalIndicators) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-neutral-10 mb-1">
            {stats.achievingIndicators}
          </div>
          <div className="text-sm text-neutral-8">Batendo Meta</div>
        </div>

        {/* Not Achieving Indicators */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-suno-red" />
            </div>
            <span className="text-xs font-medium text-suno-red">
              {Math.round((stats.notAchievingIndicators / stats.totalIndicators) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-suno-red mb-1">
            {stats.notAchievingIndicators}
          </div>
          <div className="text-sm text-neutral-8">Abaixo da Meta</div>
        </div>

        {/* Outdated Books */}
        <div className="bg-white border border-neutral-2 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-suno-red" />
            </div>
            <span className="text-xs font-medium text-suno-red">Atenção</span>
          </div>
          <div className="text-2xl font-bold text-suno-red mb-1">
            {stats.outdatedBooks}
          </div>
          <div className="text-sm text-neutral-8">Books Desatualizados</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-neutral-2 rounded-xl p-5">
        <h2 className="font-display font-semibold text-lg text-neutral-10 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/admin/backoffice/users"
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-2 hover:border-suno-red hover:bg-red-50 transition-colors"
          >
            <Users className="w-5 h-5 text-suno-red" />
            <span className="text-sm font-medium text-neutral-10">Gerenciar Usuários</span>
          </a>
          <a
            href="/admin/backoffice/indicators"
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-2 hover:border-suno-red hover:bg-red-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-suno-red" />
            <span className="text-sm font-medium text-neutral-10">Gerenciar Indicadores</span>
          </a>
          <a
            href="/admin/backoffice/books"
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-2 hover:border-suno-red hover:bg-red-50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-suno-red" />
            <span className="text-sm font-medium text-neutral-10">Gerenciar Books</span>
          </a>
          <a
            href="/admin/backoffice/settings"
            className="flex items-center gap-3 p-3 rounded-lg border border-neutral-2 hover:border-suno-red hover:bg-red-50 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-suno-red" />
            <span className="text-sm font-medium text-neutral-10">Ver Alertas</span>
          </a>
        </div>
      </div>
    </div>
  );
}

