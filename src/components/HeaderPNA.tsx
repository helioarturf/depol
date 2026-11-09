import React from 'react';
import { PNACrest } from './PNACrest';
import { ShieldCheck, Lock, UserCheck } from 'lucide-react';
import { BATCH_METRICS_CANONICAL } from '../data/mockCadastralData';

interface HeaderPNAProps {
  activeDatabase?: string;
  onSelectDatabase?: (db: string) => void;
  onOpenRules: () => void;
  onOpenReport: () => void;
}

export const HeaderPNA: React.FC<HeaderPNAProps> = ({
  activeDatabase = 'BDIC-DEPOL 2026 (Base de Doutrina & Ensino)',
  onOpenRules,
  onOpenReport,
}) => {
  return (
    <header className="bg-[#172554] text-white border-b-2 border-[#1E3A8A] shadow-md sticky top-0 z-40 select-none">
      {/* Main Institutional Header - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3 sm:gap-4">
            <PNACrest size="lg" className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  POLÍCIA NACIONAL DE ANGOLA
                </h1>
                <span className="bg-[#1E3A8A] text-amber-300 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[2px] border border-amber-500/30 whitespace-nowrap">
                  DEPOL • Ensino Policial
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 font-semibold tracking-normal mt-0.5 line-clamp-1 sm:line-clamp-none">
                Direcção de Doutrina e Ensino da Polícia (DEPOL) — SISC-DEPOL
              </p>
              {activeDatabase && (
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 text-[10px] sm:text-[11px] text-blue-300/90 font-mono flex-wrap">
                  <span className="text-amber-400 whitespace-nowrap">● Base Homologada:</span>
                  <span className="underline decoration-dotted truncate max-w-[250px] sm:max-w-none">{activeDatabase}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action & Officer Profile Panel */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-3 lg:pt-0 border-t border-blue-900/50 lg:border-t-0">
            {/* Quick Actions: Rules & Report */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:self-end">
              <button
                type="button"
                onClick={onOpenRules}
                className="bg-[#1e3a8a] hover:bg-[#2563eb] active:bg-[#172554] text-white text-xs font-semibold px-3 py-2 rounded-[4px] border border-blue-500/50 transition-all flex items-center justify-center gap-1.5"
                title="Regulamento de Doutrina e Ensino da Polícia"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Normas DEPOL</span>
              </button>

              <button
                type="button"
                onClick={onOpenReport}
                className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white text-xs font-semibold px-3 py-2 rounded-[4px] shadow-sm transition-all flex items-center justify-center gap-1.5"
                title="Emitir Certificado Pericial DEPOL"
              >
                <Lock className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Certificado DEPOL</span>
              </button>
            </div>

            {/* Logged Operator Badge */}
            <div className="bg-[#0f1d42]/90 border border-blue-800/80 rounded-[4px] p-2 flex items-center gap-2.5 sm:self-end">
              <div className="w-8 h-8 rounded-[4px] bg-blue-900 flex items-center justify-center text-amber-400 border border-amber-400/30 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-left text-xs leading-tight min-w-0">
                <p className="font-semibold text-white tracking-tight truncate">{BATCH_METRICS_CANONICAL.operatorName}</p>
                <p className="text-[10px] text-blue-300 font-mono truncate">NIP: {BATCH_METRICS_CANONICAL.operatorNip}</p>
                <p className="text-[9px] text-amber-300/80 uppercase font-medium truncate">{BATCH_METRICS_CANONICAL.operatorUnit}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative Gold Border Line from Angolan Emblem */}
      <div className="h-[3px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600"></div>
    </header>
  );
};
