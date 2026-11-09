import React, { useState } from 'react';
import {
  CadastralRecord,
  CadastralStatus,
  FilterState,
} from '../types/cadastral';
import {
  Search,
  CheckCircle,
  AlertTriangle,
  UserX,
  Eye,
  CheckCheck,
  Shield,
  ArrowUpDown,
  Filter,
  Check,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface CadastralTableProps {
  records: CadastralRecord[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onOpenAudit: (record: CadastralRecord) => void;
  onApproveRecord: (recordId: string) => void;
  onApproveBatch: (recordIds: string[]) => void;
  provinces: string[];
  ranks: string[];
  schools?: string[];
  roles?: string[];
}

export const CadastralTable: React.FC<CadastralTableProps> = ({
  records,
  filters,
  onFilterChange,
  onOpenAudit,
  onApproveRecord,
  onApproveBatch,
  provinces,
  ranks,
  schools = [],
  roles = [],
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'nip' | 'rawName' | 'similarityScore' | 'status'>('similarityScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Active filter count
  const activeFilterCount = [
    filters.status !== 'all',
    Boolean(filters.province),
    Boolean(filters.rank),
    Boolean(filters.schoolUnit),
    Boolean(filters.academicRole),
    Boolean(filters.searchQuery.trim()),
  ].filter(Boolean).length;

  // Filter logic
  const filteredRecords = records.filter((rec) => {
    if (filters.status !== 'all' && rec.status !== filters.status) {
      return false;
    }
    if (filters.province && rec.province !== filters.province) {
      return false;
    }
    if (filters.rank && rec.rank !== filters.rank) {
      return false;
    }
    if (filters.schoolUnit && rec.schoolUnit !== filters.schoolUnit) {
      return false;
    }
    if (filters.academicRole && rec.academicRole !== filters.academicRole) {
      return false;
    }
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = rec.rawName.toLowerCase().includes(q) || rec.sanitizedName.toLowerCase().includes(q);
      const matchNip = rec.nip.toLowerCase().includes(q);
      const matchBi = rec.biNumber.toLowerCase().includes(q);
      const matchUnit = rec.unit.toLowerCase().includes(q);
      const matchSchool = (rec.schoolUnit || '').toLowerCase().includes(q);
      const matchCourse = (rec.policeCourse || '').toLowerCase().includes(q);
      const matchRole = (rec.academicRole || '').toLowerCase().includes(q);
      if (!matchName && !matchNip && !matchBi && !matchUnit && !matchSchool && !matchCourse && !matchRole) {
        return false;
      }
    }
    return true;
  });

  // Sort logic
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comp = 0;
    if (sortField === 'similarityScore') {
      comp = a.similarityScore - b.similarityScore;
    } else if (sortField === 'nip') {
      comp = a.nip.localeCompare(b.nip);
    } else if (sortField === 'rawName') {
      comp = a.sanitizedName.localeCompare(b.sanitizedName);
    } else if (sortField === 'status') {
      comp = a.status.localeCompare(b.status);
    }
    return sortAsc ? comp : -comp;
  });

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredRecords.length && filteredRecords.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRecords.map((r) => r.id)));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleBatchApprove = () => {
    if (selectedIds.size === 0) return;
    onApproveBatch(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleSort = (field: 'nip' | 'rawName' | 'similarityScore' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (status: CadastralStatus) => {
    switch (status) {
      case 'valid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[2px] whitespace-nowrap">
            <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
            HOMOLOGADO
          </span>
        );
      case 'divergent':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-[2px] whitespace-nowrap">
            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
            DIVERGENTE
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-300 px-2 py-0.5 rounded-[2px] whitespace-nowrap">
            <UserX className="w-3 h-3 text-rose-600 shrink-0" />
            NÃO ENCONTRADO
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[4px] border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
      
      {/* Table Action and Filter Toolbar */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-[#E2E8F0] space-y-3">
        
        {/* Top Control Bar: Search Input + View Mode Switcher + Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full min-w-[240px] max-w-full sm:max-w-md lg:max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por NIP, Nome, BI, Posto, Escola ou Curso..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] text-xs pl-9 pr-7 py-2 rounded-[4px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Controls: Mobile Filters Button & View Switcher */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            
            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`lg:hidden text-xs font-semibold px-3 py-2 rounded-[4px] border transition-colors flex items-center gap-1.5 ${
                activeFilterCount > 0
                  ? 'bg-blue-50 text-[#1E3A8A] border-blue-300'
                  : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Filtros</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              {showMobileFilters ? (
                <ChevronUp className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-400" />
              )}
            </button>

            {/* View Mode Switcher (Table vs Cards) */}
            <div className="inline-flex items-center bg-white border border-[#CBD5E1] rounded-[4px] p-0.5 ml-auto sm:ml-0">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Visualização em Tabela Completa"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabela</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1.5 rounded-[3px] text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Visualização em Cartões Móveis"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cartões</span>
              </button>
            </div>

          </div>

        </div>

        {/* Dropdown Filters: Always visible on desktop (lg:flex), Collapsible on mobile */}
        <div
          className={`${
            showMobileFilters ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2' : 'hidden lg:flex'
          } lg:flex-wrap lg:items-center gap-2 pt-1 border-t border-slate-200/80 lg:border-t-0`}
        >
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value as any })}
            className="w-full lg:w-auto bg-white border border-[#CBD5E1] text-xs px-2.5 py-2 lg:py-1.5 rounded-[4px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          >
            <option value="all">Status: Todos</option>
            <option value="valid">Status: Homologados</option>
            <option value="divergent">Status: Divergentes</option>
            <option value="missing">Status: Não Encontrados</option>
          </select>

          {/* School / Academy DEPOL Filter */}
          {schools.length > 0 && (
            <select
              value={filters.schoolUnit || ''}
              onChange={(e) => onFilterChange({ schoolUnit: e.target.value })}
              className="w-full lg:w-auto bg-white border border-[#CBD5E1] text-xs px-2.5 py-2 lg:py-1.5 rounded-[4px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="">Escola / Academia: Todas</option>
              {schools.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Academic Role Filter */}
          {roles.length > 0 && (
            <select
              value={filters.academicRole || ''}
              onChange={(e) => onFilterChange({ academicRole: e.target.value })}
              className="w-full lg:w-auto bg-white border border-[#CBD5E1] text-xs px-2.5 py-2 lg:py-1.5 rounded-[4px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="">Função DEPOL: Todas</option>
              {roles.map((ro) => (
                <option key={ro} value={ro}>
                  {ro}
                </option>
              ))}
            </select>
          )}

          {/* Province Filter */}
          <select
            value={filters.province}
            onChange={(e) => onFilterChange({ province: e.target.value })}
            className="w-full lg:w-auto bg-white border border-[#CBD5E1] text-xs px-2.5 py-2 lg:py-1.5 rounded-[4px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          >
            <option value="">Província: Todas</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Rank Filter */}
          <select
            value={filters.rank}
            onChange={(e) => onFilterChange({ rank: e.target.value })}
            className="w-full lg:w-auto bg-white border border-[#CBD5E1] text-xs px-2.5 py-2 lg:py-1.5 rounded-[4px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          >
            <option value="">Posto: Todos</option>
            {ranks.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Reset Filters button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  status: 'all',
                  province: '',
                  rank: '',
                  schoolUnit: '',
                  academicRole: '',
                  searchQuery: '',
                })
              }
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline px-2 py-1.5 self-center"
            >
              Limpar filtros ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Bulk Selection Bar */}
        {selectedIds.size > 0 && (
          <div className="bg-[#eff4ff] border border-[#cbdcf5] px-3 py-2 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#1e3a8a]">
            <div className="flex items-center gap-2">
              <span className="font-bold">{selectedIds.size}</span>
              <span>registos selecionados de {filteredRecords.length} exibidos</span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleBatchApprove}
                className="bg-[#1E3A8A] hover:bg-[#172554] text-white font-semibold text-xs px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1 shadow-xs"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Homologar Selecionados</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-slate-600 hover:text-slate-900 px-2 py-1 underline"
              >
                Desmarcar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: RESPONSIVE MOBILE CARDS VIEW */}
      {viewMode === 'cards' ? (
        <div className="p-3 sm:p-4 bg-slate-50/50">
          {sortedRecords.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-white rounded-[4px] border border-slate-200">
              <Filter className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhum registo encontrado</p>
              <p className="text-xs text-slate-400">Tente ajustar os critérios de busca ou filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {sortedRecords.map((rec) => {
                const isSelected = selectedIds.has(rec.id);
                return (
                  <div
                    key={rec.id}
                    className={`bg-white rounded-[4px] border transition-all duration-150 p-4 space-y-3 relative ${
                      isSelected
                        ? 'border-[#1E3A8A] ring-1 ring-[#1E3A8A] shadow-sm bg-blue-50/20'
                        : rec.status === 'missing'
                        ? 'border-rose-300 bg-rose-50/10 hover:shadow-md'
                        : rec.status === 'divergent'
                        ? 'border-amber-300 bg-amber-50/10 hover:shadow-md'
                        : 'border-[#E2E8F0] hover:shadow-md'
                    }`}
                  >
                    {/* Top Header Row of Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(rec.id)}
                          className="rounded-[2px] border-slate-300 text-[#1E3A8A] focus:ring-0 cursor-pointer w-4 h-4"
                        />
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-[2px] border border-slate-200">
                          {rec.nip}
                        </span>
                      </div>
                      <div>{getStatusBadge(rec.status)}</div>
                    </div>

                    {/* Officer Identity */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-snug">
                        {rec.sanitizedName}
                      </h4>
                      {rec.rawName !== rec.sanitizedName && (
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate" title={rec.rawName}>
                          Original: {rec.rawName}
                        </p>
                      )}
                    </div>

                    {/* Rank & BI */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] label-uppercase-data text-slate-400 block">Posto</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-[#1E3A8A]" />
                          {rec.rank}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] label-uppercase-data text-slate-400 block">BI Angolano</span>
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            rec.biValidFormat ? 'text-slate-800' : 'text-rose-700 bg-rose-50 px-1 rounded-[2px]'
                          }`}
                        >
                          {rec.biNumber}
                        </span>
                      </div>
                    </div>

                    {/* DEPOL Academy & Course Info */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-[4px] p-2.5 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-1 text-[11px]">
                        <span className="font-bold text-[#1E3A8A] truncate">{rec.schoolUnit}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] shrink-0 ${
                            rec.academicRole === 'Instrutor / Docente'
                              ? 'bg-blue-100 text-[#172554]'
                              : rec.academicRole === 'Coordenador Pedagógico'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          {rec.academicRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 font-medium truncate" title={rec.policeCourse}>
                        {rec.policeCourse}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {rec.province} • {rec.unit}
                      </p>
                    </div>

                    {/* Similarity Score bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Similaridade Forense:</span>
                        <span
                          className={`font-mono font-bold ${
                            rec.similarityScore >= 95
                              ? 'text-emerald-700'
                              : rec.similarityScore >= 75
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {rec.similarityScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            rec.similarityScore >= 95
                              ? 'bg-emerald-500'
                              : rec.similarityScore >= 75
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${rec.similarityScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onOpenAudit(rec)}
                        className="w-full bg-[#1E3A8A] hover:bg-[#172554] active:bg-[#0f1d42] text-white text-xs font-semibold py-2 px-2.5 rounded-[4px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Auditar</span>
                      </button>

                      {rec.status !== 'valid' ? (
                        <button
                          type="button"
                          onClick={() => onApproveRecord(rec.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold py-2 px-2.5 rounded-[4px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Homologar</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center text-emerald-700 text-xs font-bold bg-emerald-50 rounded-[4px] border border-emerald-200">
                          ✓ Conforme
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: HIGH-DENSITY ANALYTICAL TABLE VIEW */
        <div className="relative">
          {/* Subtle mobile hint banner for table view */}
          <div className="block lg:hidden px-3 py-1.5 bg-blue-50/70 border-b border-blue-100 text-[11px] text-[#1E3A8A] flex items-center justify-between">
            <span>← Deslize horizontalmente para visualizar colunas →</span>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className="font-bold underline text-[10px]"
            >
              Mudar para modo Cartões
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[900px] lg:min-w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1]">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredRecords.length > 0 &&
                        selectedIds.size === filteredRecords.length
                      }
                      onChange={handleToggleSelectAll}
                      className="rounded-[2px] border-slate-300 text-[#1E3A8A] focus:ring-0 cursor-pointer"
                      title="Selecionar Todos"
                    />
                  </th>
                  
                  <th
                    onClick={() => handleSort('nip')}
                    className="py-3 px-3 label-uppercase-data text-[#64748B] cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>NIP / Registo</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] whitespace-nowrap">
                    Nome de Entrada (Bruto)
                  </th>

                  <th
                    onClick={() => handleSort('rawName')}
                    className="py-3 px-3 label-uppercase-data text-[#64748B] cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <span>Nome Higienizado Canônico</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] whitespace-nowrap">
                    N.º Bilhete Identidade
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] whitespace-nowrap">
                    Posto / Graduação
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] whitespace-nowrap">
                    Academia & Curso DEPOL
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] whitespace-nowrap">
                    Função no Ensino
                  </th>

                  <th
                    onClick={() => handleSort('similarityScore')}
                    className="py-3 px-3 label-uppercase-data text-[#64748B] text-center cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Similaridade</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('status')}
                    className="py-3 px-3 label-uppercase-data text-[#64748B] text-center cursor-pointer hover:text-slate-900 select-none whitespace-nowrap"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>

                  <th className="py-3 px-3 label-uppercase-data text-[#64748B] text-right whitespace-nowrap sticky right-0 bg-[#F8FAFC]">
                    Ações Forenses
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {sortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-500 bg-white">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Filter className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">Nenhum registo encontrado</p>
                        <p className="text-xs text-slate-400">Tente ajustar os critérios de busca ou filtros aplicados.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedRecords.map((rec) => {
                    const isSelected = selectedIds.has(rec.id);
                    return (
                      <tr
                        key={rec.id}
                        className={`transition-colors ${
                          isSelected
                            ? 'bg-blue-50/50'
                            : rec.status === 'missing'
                            ? 'bg-rose-50/20 hover:bg-rose-50/40'
                            : rec.status === 'divergent'
                            ? 'bg-amber-50/20 hover:bg-amber-50/40'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(rec.id)}
                            className="rounded-[2px] border-slate-300 text-[#1E3A8A] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* NIP */}
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-[2px] border border-slate-200">
                            {rec.nip}
                          </span>
                        </td>

                        {/* Raw Name */}
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px] max-w-[200px] truncate" title={rec.rawName}>
                          {rec.rawName}
                        </td>

                        {/* Sanitized / Canonical Name */}
                        <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900">{rec.sanitizedName}</span>
                            {rec.canonicalName && rec.sanitizedName !== rec.canonicalName && (
                              <span
                                className="text-[10px] text-amber-700 bg-amber-100/80 px-1 rounded-[2px]"
                                title={`Nome Canônico: ${rec.canonicalName}`}
                              >
                                Difere
                              </span>
                            )}
                          </div>
                        </td>

                        {/* BI Number */}
                        <td className="py-2.5 px-3 font-mono text-slate-800 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded-[2px] text-[11px] ${
                              rec.biValidFormat
                                ? 'bg-slate-100 text-slate-900'
                                : 'bg-rose-100 text-rose-900 border border-rose-300 font-bold'
                            }`}
                            title={rec.biValidFormat ? 'Formato de BI Válido' : 'Formato de BI Inválido'}
                          >
                            {rec.biNumber}
                          </span>
                        </td>

                        {/* Rank */}
                        <td className="py-2.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Shield className="w-3 h-3 text-[#1E3A8A]" />
                            {rec.rank}
                          </span>
                        </td>

                        {/* Academia & Curso DEPOL */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-1">
                            <span>{rec.schoolUnit}</span>
                          </div>
                          <div className="text-[11px] text-[#1E3A8A] font-medium truncate max-w-[220px]" title={rec.policeCourse}>
                            {rec.policeCourse}
                          </div>
                        </td>

                        {/* Função no Ensino & Província */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-[2px] text-[10px] font-bold ${
                            rec.academicRole === 'Instrutor / Docente'
                              ? 'bg-blue-100 text-[#172554] border border-blue-200'
                              : rec.academicRole === 'Coordenador Pedagógico'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            {rec.academicRole}
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {rec.province} • {rec.unit}
                          </span>
                        </td>

                        {/* Similarity */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  rec.similarityScore >= 95
                                    ? 'bg-emerald-500'
                                    : rec.similarityScore >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${rec.similarityScore}%` }}
                              ></div>
                            </div>
                            <span
                              className={`font-mono text-[11px] font-bold ${
                                rec.similarityScore >= 95
                                  ? 'text-emerald-700'
                                  : rec.similarityScore >= 75
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {rec.similarityScore}%
                            </span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {getStatusBadge(rec.status)}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap sticky right-0 bg-white/95">
                          <div className="flex items-center justify-end gap-1.5">
                            {rec.status !== 'valid' && (
                              <button
                                type="button"
                                onClick={() => onApproveRecord(rec.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-2 py-1 rounded-[3px] text-[11px] font-semibold transition-colors flex items-center gap-1"
                                title="Homologar Imediatamente"
                              >
                                <Check className="w-3 h-3" />
                                <span>Aprovar</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onOpenAudit(rec)}
                              className="bg-[#1E3A8A] hover:bg-[#172554] active:bg-[#0f1d42] text-white px-2 py-1 rounded-[3px] text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
                              title="Abrir Comparação Forense Detalhada"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Auditar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Table Footer with Summary */}
      <div className="p-3 bg-[#F8FAFC] border-t border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 gap-2">
        <div>
          Exibindo <strong className="text-slate-800">{sortedRecords.length}</strong> de{' '}
          <strong className="text-slate-800">{records.length}</strong> registos cadastrais no lote atual
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Padrão de Ensino & Doutrina: DEPOL-PNA v4.8 • Algoritmo de Distância Levenshtein + Jaro-Winkler
        </div>
      </div>
    </div>
  );
};
