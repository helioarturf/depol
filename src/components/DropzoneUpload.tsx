import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Download, Check, AlertCircle, FileCheck2, Database } from 'lucide-react';
import { CadastralRecord } from '../types/cadastral';
import { sanitizeOfficialName, validateAngolanBI, analyzeRecordDivergence } from '../utils/sanitizationEngine';

interface DropzoneUploadProps {
  onLoadBatch: (records: CadastralRecord[], batchName: string) => void;
  isProcessing: boolean;
}

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({ onLoadBatch, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setUploadFeedback('Aviso: O ficheiro deve ser no formato CSV (.csv) ou texto tabular (.txt).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        
        if (lines.length < 2) {
          setUploadFeedback('Erro: O ficheiro CSV não contém registos suficientes.');
          return;
        }

        // Header detection
        const parsedRecords: CadastralRecord[] = [];
        const startIndex = lines[0].toLowerCase().includes('nip') || lines[0].toLowerCase().includes('nome') ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const cols = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 2) {
            const rawNip = cols[0] || `PNA-${Math.floor(100000 + Math.random() * 900000)}`;
            const rawName = cols[1] || 'Sem Nome';
            const rawBi = cols[2] || `00${Math.floor(1000000 + Math.random() * 9000000)}LA0${Math.floor(10 + Math.random() * 89)}`;
            const rawRank = (cols[3] || 'Agente de 1.ª Classe') as any;
            const province = cols[4] || 'Luanda';
            const unit = cols[5] || 'Comando Provincial';

            const sanitized = sanitizeOfficialName(rawName);
            const biCheck = validateAngolanBI(rawBi);
            const analysis = analyzeRecordDivergence(rawName, sanitized, rawBi);

            const rawSchool = cols[6] || 'Instituto Superior de Ciências Policiais (ISCPC)';
            const rawCourse = cols[7] || 'Curso de Formação Policial';
            const rawRole = (cols[8] || 'Formando / Discente') as any;

            parsedRecords.push({
              id: `imported-${i}`,
              nip: rawNip,
              rawName,
              sanitizedName: sanitized,
              canonicalName: sanitized,
              biNumber: biCheck.normalized || rawBi,
              rank: rawRank,
              province,
              unit,
              schoolUnit: rawSchool,
              policeCourse: rawCourse,
              academicRole: rawRole,
              academicStatus: 'Homologado',
              similarityScore: analysis.similarity,
              status: analysis.status,
              divergenceType: analysis.type,
              divergenceNotes: analysis.notes,
              biValidFormat: biCheck.isValid,
              lastUpdated: 'Recém Carregado',
            });
          }
        }

        onLoadBatch(parsedRecords, file.name);
        setUploadFeedback(`Lote DEPOL "${file.name}" com ${parsedRecords.length} formandos/instrutores importado com sucesso!`);
      } catch (err) {
        setUploadFeedback('Erro ao analisar a estrutura do ficheiro CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = 
      "NIP,NOME_COMPLETO,BILHETE_IDENTIDADE,POSTO_GRADUACAO,PROVINCIA,UNIDADE,ESCOLA_DEPOL,CURSO_DOUTRINARIO,FUNCAO_ENSINO\n" +
      "PNA-094882,antonio manuel   dos SANTOS,004829102LA042,Sub-Inspector,Luanda,DEPOL / Gabinete,Instituto Superior de Ciências Policiais (ISCPC),Curso de Formação de Oficiais - CFO III,Instrutor / Docente\n" +
      "PNA-118934,manuel kiala afonso,003849102BG022,Inspector,Benguela,Centro Bula,Centro de Instrução Comandante Bula,Técnicas de Investigação Criminal,Instrutor / Docente\n" +
      "PNA-084120,esperanca da conceicao kapingana,005918234HL019,Intendente,Huíla,Escola Huíla,Escola de Polícia da Huíla,Docência Policial e Legislação,Instrutor / Docente\n" +
      "PNA-209148,Joao Baptista Mwene-Kamba,006819204LA011,1.º Sargento,Luanda,EPP Capolo,Escola Prática de Polícia (EPP - Capolo),Curso de Aperfeiçoamento de Sargentos (CAS),Formando / Discente\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'MODELO_PAUTA_DEPOL_PNA.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-[4px] border border-[#E2E8F0] p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#1E3A8A] shrink-0" />
            <span>Importação de Pautas & Efetivo da DEPOL</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Arraste ficheiros CSV de matrículas, concluintes e corpo docente das Academias e Escolas de Polícia.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-[#172554] bg-[#eff4ff] hover:bg-[#dce9ff] px-3 py-2 rounded-[4px] border border-[#cbdcf5] transition-colors w-full sm:w-auto shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Descarregar Modelo (.CSV)</span>
        </button>
      </div>

      {/* Dropzone with strict styles from DESIGN: dashed border, #F8FAFC bg, drag-over #EFF6FF */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[4px] p-4 sm:p-6 text-center transition-all cursor-pointer select-none ${
          isDragOver
            ? 'border-[#1E3A8A] bg-[#EFF6FF]'
            : 'border-[#94A3B8] bg-[#F8FAFC] hover:border-[#1E3A8A] hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-[4px] bg-white border border-[#CBD5E1] shadow-xs flex items-center justify-center text-[#1E3A8A]">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Clique para selecionar ou arraste o ficheiro de efetivo aqui
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Suporta formato CSV padronizado com cabeçalhos NIP, Nome, BI, Posto e Província
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 border border-slate-200 rounded-[2px]">
            Codificação UTF-8 ou ISO-8859-1
          </span>
        </div>
      </div>

      {uploadFeedback && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-[4px] text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            {uploadFeedback}
          </span>
          <button
            type="button"
            onClick={() => setUploadFeedback(null)}
            className="text-[11px] text-slate-500 hover:text-slate-800 underline"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};
