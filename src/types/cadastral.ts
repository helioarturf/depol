export type CadastralStatus = 'valid' | 'divergent' | 'missing';

export type PoliceRank = 
  | 'Comissário-Geral'
  | 'Comissário-Chefe'
  | 'Comissário'
  | 'Subcomissário'
  | 'Superintendente-Chefe'
  | 'Superintendente'
  | 'Intendente'
  | 'Inspector-Chefe'
  | 'Inspector'
  | 'Sub-Inspector'
  | '1.º Subchefe'
  | '2.º Subchefe'
  | '1.º Sargento'
  | '2.º Sargento'
  | 'Agente de 1.ª Classe'
  | 'Agente de 2.ª Classe'
  | 'Agente de 3.ª Classe';

export type AcademicRole = 
  | 'Formando / Discente'
  | 'Instrutor / Docente'
  | 'Coordenador Pedagógico'
  | 'Oficial Aluno';

export interface CadastralRecord {
  id: string;
  nip: string; // Número de Identificação Policial (ex: PNA-094882)
  rawName: string; // Nome de entrada / bruto
  sanitizedName: string; // Nome higienizado canónico
  canonicalName?: string; // Nome na base canónica BDIC
  biNumber: string; // Bilhete de Identidade (ex: 004829102LA042)
  rank: PoliceRank;
  province: string; // Luanda, Benguela, Huíla, etc.
  unit: string; // Unidade de Origem / Lotação
  schoolUnit: string; // Estabelecimento de Ensino Policial (ISCPC, EPP, Mazozo, etc.)
  policeCourse: string; // Curso / Especialidade Doutrinária DEPOL
  academicRole: AcademicRole; // Discente, Instrutor, etc.
  academicStatus: 'Homologado' | 'Em Formação' | 'Pendente' | 'Não Apto';
  similarityScore: number; // 0 - 100
  status: CadastralStatus;
  divergenceType?: 'orthographic' | 'missing_accent' | 'swapped_names' | 'bi_checksum_mismatch' | 'homonym_warning' | 'not_in_database';
  divergenceNotes?: string;
  biValidFormat: boolean;
  lastUpdated: string;
  auditedBy?: string;
}

export interface KPIStats {
  total: number;
  validCount: number;
  validPercent: number;
  divergentCount: number;
  divergentPercent: number;
  missingCount: number;
  missingPercent: number;
  averageSimilarity: number;
  sanitizationEfficiency: number;
}

export type ProcessingStage = 
  | 'idle'
  | 'queued' // Na Fila
  | 'sanitizing' // Higienizando Registos
  | 'validating' // Validando Nomes (X/Y)
  | 'completed'; // Concluído

export interface FilterState {
  status: 'all' | CadastralStatus;
  searchQuery: string;
  province: string;
  rank: string;
  schoolUnit?: string;
  academicRole?: string;
}
