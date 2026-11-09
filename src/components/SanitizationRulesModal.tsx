import React from 'react';
import { PNACrest } from './PNACrest';
import { X, ShieldCheck, BookOpen, CheckCircle, Code2, AlertCircle } from 'lucide-react';
import { ANGOLAN_PROVINCE_CODES } from '../utils/sanitizationEngine';

interface SanitizationRulesModalProps {
  onClose: () => void;
}

export const SanitizationRulesModal: React.FC<SanitizationRulesModalProps> = ({ onClose }) => {
  const provincesMap = [
    { code: 'LA', name: 'Luanda' },
    { code: 'BG', name: 'Benguela' },
    { code: 'HL', name: 'Huíla' },
    { code: 'HB', name: 'Huambo' },
    { code: 'CB', name: 'Cabinda' },
    { code: 'CS', name: 'Cuanza Sul' },
    { code: 'CN', name: 'Cuanza Norte' },
    { code: 'UE', name: 'Uíge' },
    { code: 'ME', name: 'Malanje' },
    { code: 'LN', name: 'Lunda Norte' },
    { code: 'LS', name: 'Lunda Sul' },
    { code: 'BO', name: 'Bengo' },
    { code: 'BI', name: 'Bié' },
    { code: 'CU', name: 'Cunene' },
    { code: 'NB', name: 'Namibe' },
    { code: 'MX', name: 'Moxico' },
    { code: 'CC', name: 'Cuando Cubango' },
    { code: 'ZE', name: 'Zaire' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div
        className="bg-white rounded-[4px] border border-[#CBD5E1] w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          boxShadow:
            '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
        }}
      >
        {/* Header */}
        <div className="bg-[#172554] text-white px-4 sm:px-5 py-3.5 flex items-start sm:items-center justify-between gap-3 border-b border-[#1E3A8A]">
          <div className="flex items-center gap-2.5">
            <PNACrest size="sm" className="shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Regulamento Técnico de Doutrina e Ensino da Polícia (DEPOL • PNA)
              </h3>
              <p className="text-[10px] sm:text-[11px] text-blue-200">
                Normas de Homologação Nominal, Controlo de Matrículas e Certificação de Cursos Policiais
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-300 hover:text-white p-2 rounded-[4px] hover:bg-blue-900/50 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Rule 1 */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-[2px] bg-[#1E3A8A] text-white flex items-center justify-center text-[10px]">1</span>
              Normalização Ortográfica & Partículas Patronímicas
            </h4>
            <p className="text-slate-600">
              Os conectores de filiação e patronímicos <code>de</code>, <code>da</code>, <code>do</code>, <code>dos</code>, <code>das</code> e a conjunção aditiva <code>e</code> são obrigatoriamente preservados em minúsculas (ex: <em>Manuel dos Santos</em>, e não <em>MANUEL DOS SANTOS</em> ou <em>Manuel Dos Santos</em>). Espaços redundantes e caracteres especiais de controle são eliminados.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-[2px] bg-[#1E3A8A] text-white flex items-center justify-center text-[10px]">2</span>
              Tratamento de Antropónimos das Línguas Nacionais de Angola
            </h4>
            <p className="text-slate-600">
              O motor fonético é ajustado para preservar especificidades morfológicas de nomes em Kimbundu, Umbundu, Kikongo e Cokwe (ex: prefixos compostos como <em>Mwene-</em>, <em>Tchissola</em>, <em>Kapingana/Capingana</em>, <em>N’zau</em>, <em>Ngola</em>, <em>Sachipango</em>), prevenindo alterações automáticas arbitrárias sem confrontação no BDIC canônico.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <span className="w-5 h-5 rounded-[2px] bg-[#1E3A8A] text-white flex items-center justify-center text-[10px]">3</span>
              Validação Estrutural do Bilhete de Identidade (BI)
            </h4>
            <p className="text-slate-600">
              O Bilhete de Identidade Nacional obedece estritamente à máscara forense de 14 caracteres:
              <strong className="block font-mono bg-white p-1.5 rounded-[2px] border border-slate-300 mt-1 text-slate-900">
                [9 Dígitos Numéricos] + [2 Letras da Província] + [3 Dígitos de Controlo] (ex: 004829102LA042)
              </strong>
            </p>
          </div>

          {/* Provinces Table */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-white space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">
              Siglas Provinciais Homologadas (Emissão de BI em Angola):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              {provincesMap.map((p) => (
                <div key={p.code} className="bg-slate-50 px-2 py-1 rounded-[2px] border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-[#1E3A8A]">{p.code}</span>
                  <span className="text-slate-600 font-sans">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Similarity threshold */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-slate-50 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">
              4. Limiares de Decisão Forense (Índice Levenshtein-Jaro):
            </h4>
            <ul className="space-y-1 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <strong>100%:</strong> Validação exata automática (Status Válido).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <strong>75% - 99%:</strong> Conflito ortográfico / acentuação (Status Divergente, requer homologação).
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <strong>Abaixo de 75%:</strong> Incompatibilidade cadastral (Status Não Encontrado, gera diligência pericial).
              </li>
            </ul>
          </div>

          {/* Rule 5 - DEPOL Accreditation */}
          <div className="border border-slate-200 rounded-[4px] p-3.5 bg-blue-50/40 space-y-1.5">
            <h4 className="font-bold text-[#1E3A8A] text-xs flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-[2px] bg-[#1E3A8A] text-white flex items-center justify-center text-[10px]">5</span>
              Certificação de Cursos & Expedição de Diplomas Oficiais DEPOL
            </h4>
            <p className="text-slate-600">
              A emissão de diplomas do Instituto Superior de Ciências Policiais e Criminais (ISCPC), da Escola Prática de Polícia (EPP - Capolo) e demais centros de instrução exige homologação prévia no SISC-DEPOL. Nenhum formando é promovido ou graduado sem a validação exata do Bilhete de Identidade e conformidade nominal com a base do Comando Geral.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-[#CBD5E1] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2 rounded-[4px] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
