import React from 'react';
import { Play, RotateCcw, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { ProcessingStage } from '../types/cadastral';

interface LinearProgressBarProps {
  stage: ProcessingStage;
  progressPercent: number;
  currentRecordCount: number;
  totalRecords: number;
  onStartProcessing: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  stage,
  progressPercent,
  currentRecordCount,
  totalRecords,
  onStartProcessing,
  onReset,
  isProcessing,
}) => {
  const stageLabels = {
    idle: 'Aguardando Início de Saneamento DEPOL',
    queued: 'Na Fila de Processamento Pedagógico',
    sanitizing: 'Higienizando Registos & Pautas de Formandos e Instrutores',
    validating: `Validando Nomes, BI e Matrículas DEPOL (${currentRecordCount}/${totalRecords})`,
    completed: 'Saneamento e Homologação DEPOL Concluídos com Sucesso',
  };

  const steps = [
    { key: 'queued', label: 'Na Fila', minPct: 15 },
    { key: 'sanitizing', label: 'Higienizando Registos', minPct: 45 },
    { key: 'validating', label: `Validando Nomes (${currentRecordCount}/${totalRecords})`, minPct: 80 },
    { key: 'completed', label: 'Concluído', minPct: 100 },
  ];

  const getStageColor = (stepMinPct: number) => {
    if (progressPercent >= stepMinPct) {
      return 'text-[#2563EB] font-bold';
    }
    return 'text-slate-400 font-medium';
  };

  return (
    <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-4 shadow-sm space-y-3">
      {/* Top Header Row with Status and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin shrink-0 mt-0.5 sm:mt-0" />
          ) : stage === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-[#1E3A8A] shrink-0 mt-0.5 sm:mt-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="label-uppercase-data text-slate-500">Pipeline DEPOL:</span>
              <span className="text-xs font-bold text-slate-800">
                {stageLabels[stage]}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5 line-clamp-1 sm:line-clamp-none">
              Normalização de pautas e registos • Validação de BI e NIP canônico
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <span className="text-xs font-bold font-mono text-[#2563EB] px-2 py-1 bg-blue-50 border border-blue-200 rounded-[2px]">
            {Math.round(progressPercent)}%
          </span>

          {stage !== 'completed' && !isProcessing && (
            <button
              type="button"
              onClick={onStartProcessing}
              className="bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-3 py-1.5 rounded-[4px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Executar Saneamento</span>
            </button>
          )}

          {isProcessing && (
            <span className="text-xs text-[#2563EB] font-medium px-2 py-1 bg-blue-50 rounded-[4px] border border-blue-200 animate-pulse">
              Processando lote...
            </span>
          )}

          {stage === 'completed' && (
            <button
              type="button"
              onClick={onReset}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-2.5 py-1.5 rounded-[4px] transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reprocessar Lote</span>
            </button>
          )}
        </div>
      </div>

      {/* Strict Design Spec: 6px height, neutral #E2E8F0 gutter, #2563EB fill */}
      <div className="w-full bg-[#E2E8F0] h-[6px] rounded-full overflow-hidden">
        <div
          className="bg-[#2563EB] h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] border-t border-slate-100">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-1.5">
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                progressPercent >= step.minPct
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {idx + 1}
            </span>
            <span className={`truncate text-[11px] ${getStageColor(step.minPct)}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
