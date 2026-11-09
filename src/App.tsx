/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { HeaderPNA } from './components/HeaderPNA';
import { KPICards } from './components/KPICards';
import { LinearProgressBar } from './components/LinearProgressBar';
import { DropzoneUpload } from './components/DropzoneUpload';
import { CadastralTable } from './components/CadastralTable';
import { AuditModal } from './components/AuditModal';
import { ForensicReportModal } from './components/ForensicReportModal';
import { SanitizationRulesModal } from './components/SanitizationRulesModal';
import { PNACrest } from './components/PNACrest';
import {
  CadastralRecord,
  CadastralStatus,
  FilterState,
  KPIStats,
  ProcessingStage,
} from './types/cadastral';
import {
  INITIAL_CADASTRAL_RECORDS,
  BATCH_METRICS_CANONICAL,
} from './data/mockCadastralData';
import {
  ShieldAlert,
  FileText,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle,
  Database,
  Building2,
  Calendar,
  Lock,
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<CadastralRecord[]>(INITIAL_CADASTRAL_RECORDS);
  const [activeDatabase, setActiveDatabase] = useState<string>(
    'BDIC-DEPOL 2026 (Base de Doutrina & Ensino)'
  );
  
  // Pipeline Processing State
  const [stage, setStage] = useState<ProcessingStage>('completed');
  const [progressPercent, setProgressPercent] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedCount, setProcessedCount] = useState<number>(BATCH_METRICS_CANONICAL.totalRecords);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    searchQuery: '',
    province: '',
    rank: '',
    schoolUnit: '',
    academicRole: '',
  });

  // Modals State
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<CadastralRecord | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Dynamic Provinces, Ranks, Schools, and Roles lists
  const provinces = useMemo(() => {
    const set = new Set(records.map((r) => r.province));
    return Array.from(set).sort();
  }, [records]);

  const ranks = useMemo(() => {
    const set = new Set(records.map((r) => r.rank));
    return Array.from(set).sort();
  }, [records]);

  const schools = useMemo(() => {
    const set = new Set(records.map((r) => r.schoolUnit).filter(Boolean));
    return Array.from(set).sort();
  }, [records]);

  const roles = useMemo(() => {
    const set = new Set(records.map((r) => r.academicRole).filter(Boolean));
    return Array.from(set).sort();
  }, [records]);

  // Aggregate KPI metrics calculated accurately
  const stats: KPIStats = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return {
        total: 0,
        validCount: 0,
        validPercent: 0,
        divergentCount: 0,
        divergentPercent: 0,
        missingCount: 0,
        missingPercent: 0,
        averageSimilarity: 0,
        sanitizationEfficiency: 0,
      };
    }

    const validCount = records.filter((r) => r.status === 'valid').length;
    const divergentCount = records.filter((r) => r.status === 'divergent').length;
    const missingCount = records.filter((r) => r.status === 'missing').length;

    const totalSim = records.reduce((acc, r) => acc + r.similarityScore, 0);
    const avgSim = Math.round(totalSim / total);

    return {
      total,
      validCount,
      validPercent: (validCount / total) * 100,
      divergentCount,
      divergentPercent: (divergentCount / total) * 100,
      missingCount,
      missingPercent: (missingCount / total) * 100,
      averageSimilarity: avgSim,
      sanitizationEfficiency: 92.5,
    };
  }, [records]);

  // Pipeline simulation
  const handleStartProcessing = () => {
    setIsProcessing(true);
    setStage('queued');
    setProgressPercent(10);
    setProcessedCount(0);

    const timer1 = setTimeout(() => {
      setStage('sanitizing');
      setProgressPercent(35);
      setProcessedCount(Math.round(records.length * 0.35));
    }, 600);

    const timer2 = setTimeout(() => {
      setStage('validating');
      setProgressPercent(75);
      setProcessedCount(Math.round(records.length * 0.75));
    }, 1300);

    const timer3 = setTimeout(() => {
      setStage('completed');
      setProgressPercent(100);
      setProcessedCount(records.length);
      setIsProcessing(false);
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleReset = () => {
    setStage('idle');
    setProgressPercent(0);
    setProcessedCount(0);
  };

  // Record actions
  const handleApproveRecord = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            status: 'valid',
            similarityScore: 100,
            sanitizedName: r.canonicalName || r.sanitizedName,
            divergenceNotes: undefined,
            lastUpdated: 'Homologado Agora',
            auditedBy: BATCH_METRICS_CANONICAL.operatorName,
          };
        }
        return r;
      })
    );
  };

  const handleApproveBatch = (recordIds: string[]) => {
    const idSet = new Set(recordIds);
    setRecords((prev) =>
      prev.map((r) => {
        if (idSet.has(r.id)) {
          return {
            ...r,
            status: 'valid',
            similarityScore: 100,
            sanitizedName: r.canonicalName || r.sanitizedName,
            divergenceNotes: undefined,
            lastUpdated: 'Homologado em Lote',
            auditedBy: BATCH_METRICS_CANONICAL.operatorName,
          };
        }
        return r;
      })
    );
  };

  const handleApplyResolution = (
    recordId: string,
    resolvedName: string,
    resolvedBi: string,
    markAsValid: boolean
  ) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            sanitizedName: resolvedName,
            canonicalName: resolvedName,
            biNumber: resolvedBi,
            status: markAsValid ? 'valid' : r.status,
            similarityScore: markAsValid ? 100 : r.similarityScore,
            divergenceNotes: markAsValid ? undefined : r.divergenceNotes,
            lastUpdated: 'Ajustado Manualmente',
            auditedBy: BATCH_METRICS_CANONICAL.operatorName,
          };
        }
        return r;
      })
    );
  };

  const handleRejectRecord = (recordId: string, reason: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            status: 'missing',
            similarityScore: 0,
            divergenceNotes: `[DILIGÊNCIA FORENSE ABERTA]: ${reason}`,
            lastUpdated: 'Inquérito Aberto',
            auditedBy: BATCH_METRICS_CANONICAL.operatorName,
          };
        }
        return r;
      })
    );
  };

  const handleLoadBatch = (newRecords: CadastralRecord[], batchName: string) => {
    setRecords(newRecords);
    handleStartProcessing();
  };

  const handleResolveFirstDivergent = () => {
    const firstDiv = records.find((r) => r.status === 'divergent');
    if (firstDiv) {
      setSelectedAuditRecord(firstDiv);
    } else {
      setFilters((prev) => ({ ...prev, status: 'divergent' }));
    }
  };

  const handleOpenMissingAudit = () => {
    const firstMissing = records.find((r) => r.status === 'missing');
    if (firstMissing) {
      setSelectedAuditRecord(firstMissing);
    } else {
      setFilters((prev) => ({ ...prev, status: 'missing' }));
    }
  };

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0B1C30]">
      {/* 1. Official Institutional Header with Crest and Security Details */}
      <HeaderPNA
        activeDatabase={activeDatabase}
        onSelectDatabase={setActiveDatabase}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Administrative Container - Full Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6">
        
        {/* Operational Context Subheader */}
        <div className="bg-white border border-[#E2E8F0] rounded-[4px] p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="label-uppercase-data text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-[2px] border border-blue-200">
                Lote Operacional Ativo
              </span>
              <span className="text-xs font-mono text-slate-500">
                {BATCH_METRICS_CANONICAL.batchId}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              {BATCH_METRICS_CANONICAL.batchName}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {BATCH_METRICS_CANONICAL.timestamp}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Direcção de Doutrina e Ensino da Polícia (DEPOL) • Luanda
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              type="button"
              onClick={() => {
                setRecords(INITIAL_CADASTRAL_RECORDS);
                setFilters({ status: 'all', searchQuery: '', province: '', rank: '', schoolUnit: '', academicRole: '' });
                handleStartProcessing();
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-[4px] border border-slate-300 transition-colors flex items-center gap-1.5"
              title="Restaurar dados originais do lote padrão"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restaurar Lote</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2 rounded-[4px] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Gerar Auto DEPOL</span>
            </button>
          </div>
        </div>

        {/* 2. KPI Cards (Disposed in 3 equal columns with 4px left borders as specified) */}
        <section aria-label="Painel de Métricas Cadastrais">
          <KPICards
            stats={stats}
            currentFilter={filters.status}
            onFilterChange={(status) => handleFilterUpdate({ status })}
            onResolveDivergences={handleResolveFirstDivergent}
            onOpenMissingAudit={handleOpenMissingAudit}
          />
        </section>

        {/* 3. Non-blocking Linear Progress Bar (6px, #E2E8F0 neutral track, #2563EB fill, 4 stages) */}
        <section aria-label="Progresso Linear de Higienização">
          <LinearProgressBar
            stage={stage}
            progressPercent={progressPercent}
            currentRecordCount={processedCount}
            totalRecords={records.length}
            onStartProcessing={handleStartProcessing}
            onReset={handleReset}
            isProcessing={isProcessing}
          />
        </section>

        {/* 4. Dropzone for CSV Lotes */}
        <section aria-label="Importação de Ficheiros">
          <DropzoneUpload
            onLoadBatch={handleLoadBatch}
            isProcessing={isProcessing}
          />
        </section>

        {/* 5. High-Density Analytical Cadastral Table */}
        <section aria-label="Tabela de Dados e Validação Forense">
          <CadastralTable
            records={records}
            filters={filters}
            onFilterChange={handleFilterUpdate}
            onOpenAudit={(rec) => setSelectedAuditRecord(rec)}
            onApproveRecord={handleApproveRecord}
            onApproveBatch={handleApproveBatch}
            provinces={provinces}
            ranks={ranks}
            schools={schools}
            roles={roles}
          />
        </section>

      </main>

      {/* Official Institutional Footer - Full Width */}
      <footer className="bg-[#172554] text-white border-t border-blue-900 mt-12 py-6 select-none">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <PNACrest size="sm" />
            <div>
              <p className="font-bold tracking-wide">
                POLÍCIA NACIONAL DE ANGOLA • DIREÇÃO DE DOUTRINA E ENSINO DA POLÍCIA (DEPOL)
              </p>
              <p className="text-[11px] text-blue-300 mt-0.5">
                Departamento Pedagógico e de Controlo Curricular • Gestão Cadastral de Formandos e Instrutores
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-blue-300 text-[11px]">
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="hover:text-white underline"
            >
              Regulamento DEPOL
            </button>
            <span>•</span>
            <span className="font-mono text-amber-300">
              SISC-DEPOL v4.8.2-SEC
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              Criptografia RDSP
            </span>
          </div>
        </div>
      </footer>

      {/* Modals with Elevation Level 3 */}
      {selectedAuditRecord && (
        <AuditModal
          record={selectedAuditRecord}
          onClose={() => setSelectedAuditRecord(null)}
          onApplyResolution={handleApplyResolution}
          onRejectRecord={handleRejectRecord}
        />
      )}

      {isReportOpen && (
        <ForensicReportModal
          stats={stats}
          records={records}
          activeDatabase={activeDatabase}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      {isRulesOpen && (
        <SanitizationRulesModal
          onClose={() => setIsRulesOpen(false)}
        />
      )}
    </div>
  );
}
