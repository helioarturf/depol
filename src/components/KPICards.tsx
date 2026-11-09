import React from 'react';
import { ShieldCheck, AlertTriangle, UserX, ArrowRight, CheckCircle2, Search, Filter } from 'lucide-react';
import { KPIStats, CadastralStatus } from '../types/cadastral';

interface KPICardsProps {
  stats: KPIStats;
  currentFilter: 'all' | CadastralStatus;
  onFilterChange: (status: 'all' | CadastralStatus) => void;
  onResolveDivergences: () => void;
  onOpenMissingAudit: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  stats,
  currentFilter,
  onFilterChange,
  onResolveDivergences,
  onOpenMissingAudit,
}) => {
  return (
    <div className="space-y-3">
      {/* 3 Main KPI Cards with 4px solid left border as specified */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1: Válidos / Encontrados (#10B981) */}
        <div
          onClick={() => onFilterChange(currentFilter === 'valid' ? 'all' : 'valid')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onFilterChange(currentFilter === 'valid' ? 'all' : 'valid');
            }
          }}
          className={`bg-white rounded-[4px] border border-[#E2E8F0] border-l-[4px] border-l-[#10B981] p-4 sm:p-5 shadow-sm transition-all duration-150 cursor-pointer select-none relative overflow-hidden ${
            currentFilter === 'valid'
              ? 'ring-2 ring-emerald-500 bg-emerald-50/20'
              : 'hover:shadow-md hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="label-uppercase-data text-slate-500 tracking-wider">
                Conformidade Doutrinária
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">
                Homologados no Ensino DEPOL
              </h3>
            </div>
            <div className="w-9 h-9 rounded-[4px] bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#10B981] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats.validCount.toLocaleString('pt-PT')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-[2px]">
              <CheckCircle2 className="w-3 h-3" />
              {stats.validPercent.toFixed(1)}% do efetivo
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 line-clamp-1">
            Confrontação nominal, curricular e biométrica exata na base DEPOL.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-700">
            <span>{currentFilter === 'valid' ? '● Filtro ativo' : 'Clique para isolar homologados'}</span>
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Com Divergências (#F59E0B) */}
        <div
          onClick={() => onFilterChange(currentFilter === 'divergent' ? 'all' : 'divergent')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onFilterChange(currentFilter === 'divergent' ? 'all' : 'divergent');
            }
          }}
          className={`bg-white rounded-[4px] border border-[#E2E8F0] border-l-[4px] border-l-[#F59E0B] p-4 sm:p-5 shadow-sm transition-all duration-150 cursor-pointer select-none relative overflow-hidden ${
            currentFilter === 'divergent'
              ? 'ring-2 ring-amber-500 bg-amber-50/20'
              : 'hover:shadow-md hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="label-uppercase-data text-slate-500 tracking-wider">
                Auditoria de Matrícula & Pauta
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">
                Com Divergências de Registo
              </h3>
            </div>
            <div className="w-9 h-9 rounded-[4px] bg-amber-50 border border-amber-200 flex items-center justify-center text-[#F59E0B] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats.divergentCount.toLocaleString('pt-PT')}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-[2px]">
              {stats.divergentPercent.toFixed(1)}% do lote
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 line-clamp-1">
            Conflitos de acentuação, grafia ou precedência patronímica em listas de cursos.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>{currentFilter === 'divergent' ? '● Filtro ativo' : 'Revisar divergências'}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResolveDivergences();
              }}
              className="text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 hover:underline text-[11px]"
            >
              Auditar Primeiro <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 3: Não Encontrados (#EF4444) */}
        <div
          onClick={() => onFilterChange(currentFilter === 'missing' ? 'all' : 'missing')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onFilterChange(currentFilter === 'missing' ? 'all' : 'missing');
            }
          }}
          className={`bg-white rounded-[4px] border border-[#E2E8F0] border-l-[4px] border-l-[#EF4444] p-4 sm:p-5 shadow-sm transition-all duration-150 cursor-pointer select-none relative overflow-hidden ${
            currentFilter === 'missing'
              ? 'ring-2 ring-rose-500 bg-rose-50/20'
              : 'hover:shadow-md hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="label-uppercase-data text-slate-500 tracking-wider">
                Alerta de Admissão / Omissões
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">
                Não Localizados na DEPOL
              </h3>
            </div>
            <div className="w-9 h-9 rounded-[4px] bg-rose-50 border border-rose-200 flex items-center justify-center text-[#EF4444] shrink-0">
              <UserX className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {stats.missingCount.toLocaleString('pt-PT')}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-rose-800 bg-rose-100/70 px-2 py-0.5 rounded-[2px]">
              {stats.missingPercent.toFixed(1)}% do lote
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2 line-clamp-1">
            Discentes ou instrutores sem homologação no plano curricular ou BI anômalo.
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>{currentFilter === 'missing' ? '● Filtro ativo' : 'Ver diligências'}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMissingAudit();
              }}
              className="text-rose-800 hover:text-rose-950 inline-flex items-center gap-1 hover:underline text-[11px]"
            >
              Abrir Diligência Forense <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Auxiliary Global Batch Audit Strip */}
      <div className="bg-[#eff4ff] border border-[#dce9ff] rounded-[4px] px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#1e3a8a]">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1e3a8a] shrink-0"></span>
            Total de Registos: <strong className="font-bold text-slate-900">{stats.total.toLocaleString('pt-PT')}</strong>
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span>
            Eficiência DEPOL: <strong className="font-bold text-emerald-700">{stats.sanitizationEfficiency}%</strong>
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span>
            Similaridade Média: <strong className="font-bold text-[#1e3a8a]">{stats.averageSimilarity}%</strong>
          </span>
        </div>

        {currentFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="text-xs font-semibold text-[#1e3a8a] underline hover:text-[#172554] self-start sm:self-auto"
          >
            Remover filtro (Exibir todos os {stats.total} registos)
          </button>
        )}
      </div>
    </div>
  );
};
