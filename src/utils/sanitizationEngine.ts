import { CadastralRecord, CadastralStatus } from '../types/cadastral';

// Angolan Provincial BI codes
export const ANGOLAN_PROVINCE_CODES = [
  'LA', // Luanda
  'BO', // Bengo
  'BG', // Benguela
  'BI', // Bié
  'CB', // Cabinda
  'CC', // Cuando Cubango
  'CN', // Cuanza Norte
  'CS', // Cuanza Sul
  'CU', // Cunene
  'HB', // Huambo
  'HL', // Huíla
  'LN', // Lunda Norte
  'LS', // Lunda Sul
  'ME', // Malanje
  'MX', // Moxico
  'NB', // Namibe
  'UE', // Uíge
  'ZE', // Zaire
  'IK', // Icolo e Bengo (historico)
];

// Prepositions and particles that stay lowercase in official Angolan and Portuguese names
const PARTICLES = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * Normalizes an official Angolan / Portuguese name:
 * - Trims whitespace and collapses double spaces
 * - Removes non-alphabetic symbols except valid hyphens and apostrophes
 * - Capitalizes words properly, keeping patronymic prepositions lowercase
 */
export function sanitizeOfficialName(rawName: string): string {
  if (!rawName) return '';

  // Remove spurious characters (quotes, backslashes, numbers, control chars)
  let cleaned = rawName
    .replace(/[0-9*#@!$%&_+=~`<>{}[\];:]+/g, ' ')
    .replace(/["'""'']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words and apply standard title casing
  const words = cleaned.toLowerCase().split(' ');
  const capitalized = words.map((word, index) => {
    if (word.length === 0) return '';
    // First and last words are always capitalized, even if a preposition
    if (index > 0 && index < words.length - 1 && PARTICLES.has(word)) {
      return word;
    }
    // Handle hyphenated names like "Silva-Neto" or "Tchi-Kapa"
    if (word.includes('-')) {
      return word
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('-');
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  return capitalized.filter(Boolean).join(' ');
}

/**
 * Validates Angolan Bilhete de Identidade format:
 * 9 digits + 2 letters (Provincial code) + 3 digits (e.g., 004829102LA042)
 */
export function validateAngolanBI(bi: string): { isValid: boolean; normalized: string; provinceCode: string } {
  if (!bi) return { isValid: false, normalized: '', provinceCode: '' };

  const cleaned = bi.toUpperCase().replace(/[^0-9A-Z]/g, '');
  const biRegex = /^(\d{9})([A-Z]{2})(\d{3})$/;
  const match = cleaned.match(biRegex);

  if (!match) {
    return { isValid: false, normalized: cleaned, provinceCode: '' };
  }

  const provinceCode = match[2];
  const isValidCode = ANGOLAN_PROVINCE_CODES.includes(provinceCode);

  return {
    isValid: isValidCode,
    normalized: cleaned,
    provinceCode,
  };
}

/**
 * Calculate Levenshtein distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  const m = s1.length;
  const n = s2.length;
  
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Computes a percentage similarity score (0 to 100) between two names
 */
export function calculateNameSimilarity(raw: string, canonical: string): number {
  if (!raw || !canonical) return 0;
  const normRaw = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const normCanonical = canonical.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  if (normRaw === normCanonical) return 100;

  const maxLen = Math.max(normRaw.length, normCanonical.length);
  if (maxLen === 0) return 100;

  const dist = levenshteinDistance(normRaw, normCanonical);
  const score = Math.max(0, Math.round((1 - dist / maxLen) * 100));

  // Check if it's the exact same words in different order
  const rawWords = normRaw.split(' ').sort().join(' ');
  const canonWords = normCanonical.split(' ').sort().join(' ');
  if (rawWords === canonWords) {
    return Math.max(score, 94);
  }

  return score;
}

/**
 * Determines divergence classification between an input record and canonical base
 */
export function analyzeRecordDivergence(
  rawName: string,
  canonicalName: string | undefined,
  bi: string
): {
  status: CadastralStatus;
  similarity: number;
  type?: CadastralRecord['divergenceType'];
  notes?: string;
} {
  const biCheck = validateAngolanBI(bi);
  
  if (!canonicalName) {
    return {
      status: 'missing',
      similarity: 0,
      type: 'not_in_database',
      notes: 'Registo não localizado na base canônica central BDIC-PNA. Necessária auditoria de admissão ou averiguação.',
    };
  }

  const similarity = calculateNameSimilarity(rawName, canonicalName);
  const sanitized = sanitizeOfficialName(rawName);

  if (sanitized === canonicalName && biCheck.isValid) {
    return {
      status: 'valid',
      similarity: 100,
      notes: 'Conformidade cadastral e biométrica plena.',
    };
  }

  if (!biCheck.isValid) {
    return {
      status: 'divergent',
      similarity,
      type: 'bi_checksum_mismatch',
      notes: `Formato de BI irregular (${bi}). Padrão esperado: 9 dígitos + sigla provincial + 3 dígitos de controlo.`,
    };
  }

  // Check for accent divergence
  const rawNoAccent = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const canonNoAccent = canonicalName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (rawNoAccent === canonNoAccent) {
    return {
      status: 'divergent',
      similarity: 98,
      type: 'missing_accent',
      notes: 'Divergência ortográfica restrita a acentuação gráfica oficial.',
    };
  }

  // Check swapped order
  const rawWords = sanitized.split(' ').sort().join(' ');
  const canonWords = canonicalName.split(' ').sort().join(' ');
  if (rawWords === canonWords) {
    return {
      status: 'divergent',
      similarity: 95,
      type: 'swapped_names',
      notes: 'Inversão na ordem dos apelidos ou patronímicos em relação ao assento canónico.',
    };
  }

  if (similarity >= 75) {
    return {
      status: 'divergent',
      similarity,
      type: 'orthographic',
      notes: `Variação gráfica identificada (${similarity}% de correspondência). Sugerida validação pericial.`,
    };
  }

  return {
    status: 'missing',
    similarity,
    type: 'not_in_database',
    notes: 'Correspondência abaixo do limiar de segurança forense (<75%). Risco de homonímia falsa.',
  };
}
