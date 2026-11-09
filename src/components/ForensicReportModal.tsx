import React from 'react';
import { PNACrest } from './PNACrest';
import { KPIStats, CadastralRecord } from '../types/cadastral';
import { BATCH_METRICS_CANONICAL } from '../data/mockCadastralData';
import { X, Printer, Download, ShieldCheck, Award, QrCode, CheckCircle2 } from 'lucide-react';

interface ForensicReportModalProps {
  stats: KPIStats;
  records: CadastralRecord[];
  activeDatabase: string;
  onClose: () => void;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  stats,
  records,
  activeDatabase,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'NIP',
      'NOME_ORIGINAL_BRUTO',
      'NOME_HIGIENIZADO_CANONICO',
      'BILHETE_IDENTIDADE',
      'POSTO_GRADUACAO',
      'PROVINCIA',
      'UNIDADE',
      'SIMILARIDADE_PCT',
      'STATUS_FINAL',
      'DIAGNOSTICO_FORENSE'
    ];

    const rows = records.map((r) => [
      r.nip,
      `"${r.rawName.replace(/"/g, '""')}"`,
      `"${r.sanitizedName.replace(/"/g, '""')}"`,
      r.biNumber,
      `"${r.rank}"`,
      `"${r.province}"`,
      `"${r.unit}"`,
      `${r.similarityScore}%`,
      r.status.toUpperCase(),
      `"${(r.divergenceNotes || 'Conformidade plena').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `RELATORIO_FORENSE_PNA_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs select-none overflow-y-auto">
      <div
        className="bg-white rounded-[4px] border border-[#CBD5E1] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          boxShadow:
            '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-[#172554] text-white px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E3A8A] print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              Certificado & Relatório Pericial Forense Cadastral
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-[4px] transition-colors flex items-center justify-center gap-1.5 touch-manipulation min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar (.CSV)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-[4px] transition-colors flex items-center justify-center gap-1.5 touch-manipulation min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-blue-300 hover:text-white p-2 rounded-[4px] hover:bg-blue-900/50 min-h-[36px] min-w-[36px] flex items-center justify-center ml-auto sm:ml-0"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-slate-800 bg-white">
          
          {/* Official Heraldic Document Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-2">
            <div className="flex justify-center mb-1">
              <PNACrest size="lg" />
            </div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-600">
              República de Angola • Ministério do Interior
            </h2>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide text-slate-950 uppercase font-sans">
              Polícia Nacional de Angola
            </h1>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Comando Geral • Direcção de Doutrina e Ensino da Polícia (DEPOL)
            </p>
            <div className="inline-block bg-[#172554] text-white text-xs font-bold px-4 py-1 rounded-[2px] tracking-wider uppercase mt-2">
              Auto de Homologação Cadastral Discente e Docente (DEPOL-PNA)
            </div>
          </div>

          {/* Certificate Identification Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 border border-slate-200 p-4 rounded-[4px]">
            <div>
              <p className="text-slate-500 label-uppercase-data">Identificador do Lote:</p>
              <p className="font-mono font-bold text-slate-900">{BATCH_METRICS_CANONICAL.batchId}</p>
            </div>
            <div>
              <p className="text-slate-500 label-uppercase-data">Base Canônica Confrontada:</p>
              <p className="font-bold text-slate-900">{activeDatabase}</p>
            </div>
            <div>
              <p className="text-slate-500 label-uppercase-data">Perito Operador Responsável:</p>
              <p className="font-semibold text-slate-900">
                {BATCH_METRICS_CANONICAL.operatorName} ({BATCH_METRICS_CANONICAL.operatorNip})
              </p>
            </div>
            <div>
              <p className="text-slate-500 label-uppercase-data">Data & Hora de Emissão:</p>
              <p className="font-mono text-slate-900">{BATCH_METRICS_CANONICAL.timestamp}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-slate-500 label-uppercase-data">Assinatura Criptográfica SHA-256:</p>
              <p className="font-mono text-[11px] text-slate-700 bg-white p-1.5 rounded-[2px] border border-slate-300 break-all select-all">
                {BATCH_METRICS_CANONICAL.hashSHA256}
              </p>
            </div>
          </div>

          {/* Executive Quantitative Summary */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              1. Resumo Quantitativo da Auditoria de Efetivos
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-[4px]">
                <span className="text-[10px] label-uppercase-data text-slate-500 block">Total Auditado</span>
                <span className="text-xl font-bold text-slate-900">{stats.total}</span>
                <span className="text-[10px] text-slate-500 block">100%</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-[4px]">
                <span className="text-[10px] label-uppercase-data text-emerald-800 block">Conformidade Plena</span>
                <span className="text-xl font-bold text-emerald-700">{stats.validCount}</span>
                <span className="text-[10px] text-emerald-800 block font-semibold">{stats.validPercent.toFixed(1)}%</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-[4px]">
                <span className="text-[10px] label-uppercase-data text-amber-800 block">Divergências</span>
                <span className="text-xl font-bold text-amber-700">{stats.divergentCount}</span>
                <span className="text-[10px] text-amber-800 block font-semibold">{stats.divergentPercent.toFixed(1)}%</span>
              </div>
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-[4px]">
                <span className="text-[10px] label-uppercase-data text-rose-800 block">Não Encontrados</span>
                <span className="text-xl font-bold text-rose-700">{stats.missingCount}</span>
                <span className="text-[10px] text-rose-800 block font-semibold">{stats.missingPercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Detailed Sample Forensic Confrontations */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
              2. Amostra de Registos Auditados e Saneados
            </h3>
            <div className="border border-slate-200 rounded-[4px] overflow-x-auto">
              <table className="w-full text-left text-[11px] min-w-[550px]">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <tr>
                    <th className="p-2">NIP</th>
                    <th className="p-2">Nome Homologado</th>
                    <th className="p-2">BI</th>
                    <th className="p-2">Posto</th>
                    <th className="p-2">Escola / Academia</th>
                    <th className="p-2">Curso DEPOL</th>
                    <th className="p-2">Função</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {records.slice(0, 8).map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 font-mono font-bold">{r.nip}</td>
                      <td className="p-2 font-semibold text-slate-900">{r.sanitizedName}</td>
                      <td className="p-2 font-mono">{r.biNumber}</td>
                      <td className="p-2">{r.rank}</td>
                      <td className="p-2 font-medium">{r.schoolUnit}</td>
                      <td className="p-2 text-[#1E3A8A] font-medium">{r.policeCourse}</td>
                      <td className="p-2">{r.academicRole}</td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded-[2px] font-bold text-[9px] uppercase ${
                            r.status === 'valid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : r.status === 'divergent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.status === 'valid' ? 'Homologado' : r.status === 'divergent' ? 'Divergente' : 'Omisso'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Stamps and Signatures Block */}
          <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center text-xs">
            
            {/* Left: Security QR Code */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 border border-slate-300 p-1 flex items-center justify-center">
                <QrCode className="w-16 h-16 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">
                VALIDAÇÃO DEPOL-PNA
              </span>
            </div>

            {/* Middle: Forensic Seal Stamp */}
            <div className="border-2 border-dashed border-[#1E3A8A] rounded-[4px] p-3 bg-blue-50/50">
              <span className="block font-bold text-[#1E3A8A] uppercase text-[10px]">
                POLÍCIA NACIONAL DE ANGOLA
              </span>
              <span className="block text-[9px] text-slate-600 uppercase font-semibold">
                DIRECÇÃO DE DOUTRINA E ENSINO (DEPOL)
              </span>
              <div className="my-1 py-0.5 border-y border-[#1E3A8A] text-[#1E3A8A] font-black text-xs tracking-wider uppercase">
                HOMOLOGADO DEPOL
              </div>
              <span className="text-[9px] font-mono text-slate-500 block">
                MATRÍCULA {BATCH_METRICS_CANONICAL.operatorNip}
              </span>
            </div>

            {/* Right: Signature */}
            <div className="space-y-1">
              <div className="h-10 border-b border-slate-800 flex items-end justify-center font-serif italic text-sm text-slate-700">
                Manuel K. Afonso
              </div>
              <p className="font-bold text-slate-900 text-xs">O Perito Pedagógico & Cadastral</p>
              <p className="text-[10px] text-slate-500">DEPOL • Sub-Inspector de Polícia</p>
            </div>

          </div>

          <p className="text-[9px] text-center text-slate-400 font-mono pt-4">
            Este documento possui fé pública institucional nos termos do Regulamento de Pessoal da Polícia Nacional de Angola e da Lei de Segurança Pública da República de Angola.
          </p>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-[#CBD5E1] flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2 rounded-[4px] transition-colors"
          >
            Concluir e Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
