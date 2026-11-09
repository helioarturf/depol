---
name: Segurança Institucional PNA
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#192756'
  on-tertiary: '#ffffff'
  tertiary-container: '#303d6d'
  on-tertiary-container: '#9ca9e0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b7c4fd'
  on-tertiary-fixed: '#071747'
  on-tertiary-fixed-variant: '#374475'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  police-blue-vibrant: '#2563EB'
  police-blue-deep: '#172554'
  emblem-gold-bright: '#F59E0B'
  status-valid: '#10B981'
  status-divergent: '#F59E0B'
  status-missing: '#EF4444'
  surface-bg: '#F8FAFC'
  surface-card: '#FFFFFF'
  border-subtle: '#E2E8F0'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-sm:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.025em
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-uppercase-data:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

Este sistema de design foi concebido para plataformas governamentais de segurança pública e saneamento de registros cadastrais da Polícia Nacional de Angola (PNA). A identidade visual projeta autoridade serena, integridade de dados e conformidade estrita com padrões forenses e de inteligência policial.

O estilo orientador é o **Corporate / Modern de Alta Densidade Informacional**, combinando a solidez e a sobriedade das forças da ordem com a eficiência de ferramentas analíticas contemporâneas. A experiência do utilizador equilibra clareza tática, redução drástica de fadiga cognitiva em auditorias volumosas e resposta visual imediata no processamento de lotes cadastrais. Superfícies brancas com cinzas funcionais neutralizam o ruído, permitindo que a paleta heráldica — o azul profundo e os acentos dourados institucionais — confira distinção oficial e gravidade cívica a cada ecrã.

## Colors

A hierarquia cromática baseia-se diretamente na heráldica da Polícia Nacional de Angola:
- **Azul Primário (`#1E3A8A`) e Azul Profundo (`#172554`)**: Transmitem a soberania da autoridade estatal, ordem e integridade institucional. Empregados no cabeçalho primário, botões de ação estruturante, barras de navegação superior e estados de foco. O tom vibrante (`#2563EB`) é reservado para apontamentos interativos, links e indicadores de progresso linear ativo.
- **Acento Dourado Institucional (`#D97706` / `#F59E0B`)**: Inspirado nas divisas e detalhes solares da insígnia republicana. Utilizado estritamente para insígnias de certificação, destaques funcionais e avisos prioritários.
- **Paleta de Status Operacional**:
  - `status-valid` (`#10B981`): Validação cadastral exata, integridade confirmada.
  - `status-divergent` (`#F59E0B`): Conflito ortográfico, duplicidade ou necessidade de revisão de homônimos.
  - `status-missing` (`#EF4444`): Registo não localizado na base canônica, alerta crítico ou falha estrutural de arquivo.
- **Superfície e Neutros (`#F8FAFC`, `#FFFFFF`, `#64748B`)**: Estruturam um fundo asséptico, livre de distorções visuais para visualização tabular extensiva e processamento de ficheiros CSV.

## Typography

A tipografia é padronizada com **Public Sans**, uma família grotesca concebida para sistemas administrativos, governamentais e de alta densidade técnica. Ela garante legibilidade inequívoca em ecrãs de monitorização, células tabulares complexas e etiquetas de identidade.

Para dados processados pelo pipeline de higienização de nomes e chaves de identificação nacional (como número de Bilhete de Identidade ou processo criminal), adota-se o padrão `label-uppercase-data`, forçando a apresentação visual em caixa alta com espaçamento alargado (`0.08em`), prevenindo ambiguidade entre caracteres como 'I', '1' e 'l'.

## Layout & Spacing

O sistema emprega uma malha fluida adaptável de 12 colunas em desktop com calhas de `1.5rem` (24px) e margens exteriores de `2rem` (32px), reduzindo para 8 colunas em tablets e 4 colunas em dispositivos móveis (`margin: 1rem`). 

A distribuição espacial respeita o ritmo estrito de múltiplos de 4px e 8px:
- **Painéis e Cards de KPI**: Dispostos lado a lado em 3 colunas de igual proporção nas resoluções desktop (`col-span-4`), empilhando-se verticalmente em telas menores que 768px.
- **Tabelas Analíticas e Dropzones**: Ocupam a totalidade do contenedor central com acolchoamento interno estrito de `space-md` (16px) e divisores horizontais compactos para elevar a densidade de linhas visíveis sem rolagem forçada.

## Elevation & Depth

A profundidade é executada com sobriedade clínica e controle institucional, evitando sombras volumosas ou estéticas lúdicas:
- **Nível 0 (Superfície Base)**: `background-color: #F8FAFC` sem qualquer projeção de sombra.
- **Nível 1 (Cartões de Métricas e Tabelas)**: `background-color: #FFFFFF`, delimitados por contorno subtil `1px solid #E2E8F0` e uma sombra difusa suave: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Nível 2 (Foco, Hover de Registros e Dropdowns)**: `box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.08), 0 2px 4px -2px rgba(30, 58, 138, 0.04)`.
- **Nível 3 (Toasts de Notificação e Modais de Confirmação Forense)**: `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)`.

## Shapes

Adota-se a curvatura de nível **1 (Soft)** (`border-radius: 0.25rem` / 4px base, com `0.5rem` / 8px para contornos maiores de cartões). 

Essa escolha enfatiza o rigor procedimental da segurança pública, conferindo cantos estruturados e precisos aos formulários, tabelas e janelas de auditoria. Botões e etiquetas de status mantêm extremidades contidas, eliminando formatos arredondados ou em formato de pílula excessivamente informais.

## Components

### Botões
- **Primário (Ação Institucional)**: Fundo `#1E3A8A`, texto branco, cantos arredondados de 4px, altura de 40px com microinteração de transição sutil em `all 150ms ease-in-out`. Em hover, escurece para `#172554` com elevação sutil Nível 1.
- **Secundário / Neutro**: Fundo branco, contorno de 1px em `#CBD5E1`, texto `#1E3A8A`. Em hover, fundo `#F1F5F9`.
- **Ação Perigosa**: Fundo `#EF4444`, texto branco, com foco com contorno anelar de alerta.

### Cartões de Métricas (KPI Cards)
Desenvolvidos para exibição dos estados cadastrais agregados:
- Borda esquerda de destaque cromático espessa (4px sólida) associada ao status:
  - **Válidos / Encontrados**: Borda `#10B981`, ícone de verificação, contador numérico em destaque com tipografia `headline-lg`.
  - **Com Divergências**: Borda `#F59E0B`, ícone de atenção e indicador percentual de discrepâncias.
  - **Não Encontrados**: Borda `#EF4444`, ícone de não conformidade e atalho de ação corretiva.

### Barra de Progresso Linear
- Componente não-bloqueante exibido no topo do módulo analítico durante o saneamento:
  - Fundo em calha neutra `#E2E8F0` com altura de 6px.
  - Barra de preenchimento em `#2563EB` animada com indicador de estágio: `Na Fila` ➔ `Higienizando Registos` ➔ `Validando Nomes (X/Y)` ➔ `Concluído`.

### Dropzone de Arquivos (CSV / Lotes)
- Área retangular pontilhada (`border: 2px dashed #94A3B8`), fundo `#F8FAFC`.
- Estado de arrasto ativo (`drag-over`): Fundo `#EFF6FF` e borda `#1E3A8A`.

### Tabela de Dados e Validação
- Cabeçalhos de coluna em caixa alta cinza (`#64748B`, estilo `label-uppercase-data`), fundo `#F8FAFC` e borda inferior rígida de 1px (`#CBD5E1`).
- Linhas alternadas ou com separadores horizontais de 1px em `#E2E8F0`, destacando nomes higienizados em `Public Sans Medium` e badges de status correspondentes para cada registro.