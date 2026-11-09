import React, { useState } from 'react';
import { PNACrest } from './PNACrest';
import {
  CadastralRecord,
} from '../types/cadastral';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  UserX,
  CheckCircle,
  FileText,
  BadgeAlert,
  ArrowRight,
  ShieldAlert,
  Save,
  Fingerprint,
} from 'lucide-react';

interface AuditModalProps {
  record: CadastralRecord | null;
  onClose: () => void;
  onApplyResolution: (
    recordId: string,
    resolvedName: string,
    resolvedBi: string,
    markAsValid: boolean
  ) => void;
  onRejectRecord: (recordId: string, reason: string) => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  record,
  onClose,
  onApplyResolution,
  onRejectRecord,
}) => {
  if (!record) return null;

  const [editMode, setEditMode] = useState(false);
  const [customName, setCustomName] = useState(
    record.canonicalName || record.sanitizedName
  );
  const [customBi, setCustomBi] = useState(record.biNumber);
  const [rejectReason, setRejectReason] = useState(
    'Inconsistência cadastral insanável na base primária.'
  );
  const [isRejecting, setIsRejecting] = useState(false);

  const handleHomologateCanonical = () => {
    const targetName = record.canonicalName || record.sanitizedName;
    onApplyResolution(record.id, targetName, record.biNumber, true);
    onClose();
  };

  const handleHomologateSanitized = () => {
    onApplyResolution(record.id, record.sanitizedName, record.biNumber, true);
    onClose();
  };

  const handleSaveCustom = () => {
    onApplyResolution(record.id, customName, customBi, true);
    onClose();
  };

  const handleConfirmReject = () => {
    onRejectRecord(record.id, rejectReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      {/* Modal Dialog with Elevation Level 3 */}
      <div
        className="bg-white rounded-[4px] border border-[#CBD5E1] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          boxShadow:
            '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Modal Header */}
        <div className="bg-[#172554] text-white px-4 sm:px-5 py-3.5 flex items-start sm:items-center justify-between gap-3 border-b border-[#1E3A8A]">
          <div className="flex items-center gap-2.5">
            <PNACrest size="sm" className="shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span>Confrontação Forense & Homologação DEPOL</span>
                <span className="text-[10px] bg-blue-900 text-amber-300 font-mono px-1.5 py-0.5 rounded-[2px] border border-amber-500/20">
                  {record.nip}
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-blue-200">
                Direcção de Doutrina e Ensino da Polícia (DEPOL • PNA)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-[4px] hover:bg-blue-900/50 transition-colors shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Officer Identity & Academic Summary */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-[4px] space-y-2 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="label-uppercase-data text-slate-500 block">NIP</span>
                <span className="font-mono font-bold text-slate-900">{record.nip}</span>
              </div>
              <div>
                <span className="label-uppercase-data text-slate-500 block">Posto</span>
                <span className="font-semibold text-slate-900">{record.rank}</span>
              </div>
              <div>
                <span className="label-uppercase-data text-slate-500 block">Função DEPOL</span>
                <span className="font-bold text-[#1E3A8A]">{record.academicRole}</span>
              </div>
              <div>
                <span className="label-uppercase-data text-slate-500 block">Província</span>
                <span className="font-semibold text-slate-900">{record.province}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="label-uppercase-data text-slate-500 block">Escola / Academia de Polícia</span>
                <span className="font-semibold text-slate-900">{record.schoolUnit}</span>
              </div>
              <div>
                <span className="label-uppercase-data text-slate-500 block">Curso Doutrinário / Especialidade</span>
                <span className="font-semibold text-[#1E3A8A]">{record.policeCourse}</span>
              </div>
            </div>
          </div>

          {/* Divergence Notification Banner */}
          {record.divergenceNotes && (
            <div className="bg-amber-50 border border-amber-300 rounded-[4px] p-3 text-xs flex items-start gap-2.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Diagnóstico do Pipeline Forense:</strong>
                <p className="mt-0.5 text-amber-800">{record.divergenceNotes}</p>
              </div>
            </div>
          )}

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Panel 1: Dado Submetido no Lote */}
            <div className="border border-[#CBD5E1] rounded-[4px] p-3.5 bg-white space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="label-uppercase-data text-slate-500">
                  Dado de Entrada no Lote
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-[2px] font-mono">
                  ORIGINAL BRUTO
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block">
                  Nome Submetido
                </label>
                <div className="font-mono text-sm font-semibold text-slate-800 bg-slate-50 p-2 rounded-[2px] border border-slate-200 break-words">
                  {record.rawName}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block">
                  Bilhete de Identidade (BI)
                </label>
                <div
                  className={`font-mono text-xs font-bold p-2 rounded-[2px] border ${
                    record.biValidFormat
                      ? 'bg-slate-50 text-slate-800 border-slate-200'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  {record.biNumber}
                  {!record.biValidFormat && (
                    <span className="block text-[10px] font-normal text-rose-600 mt-0.5">
                      ✕ Formato fora do padrão nacional angolano
                    </span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1">
                Submetido em folha de contingente operacional provincial.
              </div>
            </div>

            {/* Panel 2: Correspondência Canônica BDIC-PNA */}
            <div className="border border-[#CBD5E1] rounded-[4px] p-3.5 bg-blue-50/30 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <span className="label-uppercase-data text-[#1E3A8A]">
                  Base Central Canônica (BDIC)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-[2px]">
                  HOMOLOGADO
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block">
                  Nome Canônico Homologado
                </label>
                <div className="font-semibold text-sm text-[#172554] bg-white p-2 rounded-[2px] border border-blue-200 break-words">
                  {record.canonicalName || (
                    <span className="text-rose-600 italic">
                      [Registo Omisso na Base Central Canônica]
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block">
                  Nome Higienizado Automático
                </label>
                <div className="text-xs font-semibold text-slate-800 bg-white p-2 rounded-[2px] border border-slate-200 break-words">
                  {record.sanitizedName}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500">Índice de Similaridade:</span>
                <span className="font-mono font-bold text-[#1E3A8A]">
                  {record.similarityScore}%
                </span>
              </div>
            </div>

          </div>

          {/* Edit Custom Resolution Accordion */}
          {editMode && (
            <div className="bg-slate-50 border border-slate-300 p-3 rounded-[4px] space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
                Edição Manual / Ajuste Pericial do Registo
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nome Oficial Retificado:
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-white border border-slate-300 text-xs px-2.5 py-1.5 rounded-[4px] focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    N.º de Bilhete de Identidade (BI):
                  </label>
                  <input
                    type="text"
                    value={customBi}
                    onChange={(e) => setCustomBi(e.target.value)}
                    className="w-full bg-white border border-slate-300 font-mono text-xs px-2.5 py-1.5 rounded-[4px] focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded-[4px] bg-white"
                >
                  Cancelar Edição
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-3 py-1 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-[4px] flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Salvar e Homologar
                </button>
              </div>
            </div>
          )}

          {/* Rejection Form Accordion */}
          {isRejecting && (
            <div className="bg-rose-50 border border-rose-300 p-3 rounded-[4px] space-y-2">
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Despacho de Diligência / Rejeição Forense
              </h4>
              <p className="text-[11px] text-rose-700">
                O registo será marcado como não conforme e encaminhado para averiguação presencial junto da IGAE/DTTI.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                className="w-full bg-white border border-rose-300 text-xs p-2 rounded-[4px] focus:ring-1 focus:ring-rose-500"
                placeholder="Insira a fundamentação técnica do indeferimento..."
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800 border border-slate-300 rounded-[4px] bg-white"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-3 py-1 text-xs font-bold text-white bg-[#EF4444] hover:bg-rose-700 rounded-[4px]"
                >
                  Confirmar Diligência Forense
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Strict Primary/Secondary/Danger Button styles */}
        <div className="bg-slate-50 px-4 sm:px-5 py-3 border-t border-[#CBD5E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            {!editMode && !isRejecting && (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="text-xs text-[#1E3A8A] hover:underline font-semibold"
              >
                Editar Manualmente
              </button>
            )}
            {!isRejecting && (
              <button
                type="button"
                onClick={() => setIsRejecting(true)}
                className="text-xs text-[#EF4444] hover:underline font-semibold"
              >
                Abrir Inquérito
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial bg-white hover:bg-[#F1F5F9] text-[#1E3A8A] border border-[#CBD5E1] text-xs font-semibold px-4 py-2.5 rounded-[4px] transition-all text-center"
            >
              Fechar
            </button>

            {record.canonicalName && (
              <button
                type="button"
                onClick={handleHomologateCanonical}
                className="flex-1 sm:flex-initial bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Homologar Canônico</span>
              </button>
            )}

            {!record.canonicalName && (
              <button
                type="button"
                onClick={handleHomologateSanitized}
                className="flex-1 sm:flex-initial bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 text-center"
              >
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Adotar Higienizado</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
