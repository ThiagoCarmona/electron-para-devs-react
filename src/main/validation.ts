/**
 * validation.ts — Validação de inputs no Main Process
 *
 * REGRA DE OURO: nunca confie nos dados vindos do renderer.
 *
 * Mesmo usando contextBridge e IPC seguro, o renderer pode ser comprometido
 * (ex.: XSS, extensão maliciosa). Por isso, TODA entrada deve ser validada
 * no main process antes de chegar ao banco de dados.
 *
 * Tipos de validação implementados aqui:
 * 1. Verificação de tipo (typeof): garante que strings são strings
 * 2. Limite de tamanho: previne ataques de DoS por payload gigante
 * 3. Formato de ID: aceita apenas UUID/alfanuméricos (previne SQL injection)
 * 4. Sanitização: remove caracteres de controle perigosos
 *
 * Por que `unknown` nos parâmetros?
 * O TypeScript não pode garantir o tipo real dos dados IPC em runtime.
 * Usar `unknown` força a verificação de tipo explícita antes do uso.
 */

// Limites para prevenir payloads excessivamente grandes
const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 100_000 // 100k caracteres (~100KB)

/**
 * Resultado da validação: `valid` indica se passou, `error` descreve o problema.
 * Este padrão é preferível a lançar exceções diretamente, pois permite
 * ao chamador decidir como tratar o erro.
 */
interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Valida título e conteúdo de uma nota.
 * Aceita `unknown` porque os dados vêm do IPC (não são confiáveis em runtime).
 */
export function validateNoteInput(title: unknown, content: unknown): ValidationResult {
  // Etapa 1: Verificação de tipo em runtime
  if (typeof title !== 'string') {
    return { valid: false, error: 'Título deve ser uma string' }
  }

  if (typeof content !== 'string') {
    return { valid: false, error: 'Conteúdo deve ser uma string' }
  }

  // Etapa 2: Limites de tamanho (previne DoS por payload grande)
  if (title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Título não pode ter mais de ${MAX_TITLE_LENGTH} caracteres` }
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `Conteúdo não pode ter mais de ${MAX_CONTENT_LENGTH} caracteres` }
  }

  return { valid: true }
}

/**
 * Valida um ID de nota.
 * Aceita apenas strings alfanuméricas com hífens (formato UUID v4).
 * Isso previne injeção de SQL caso o ID seja usado diretamente em queries.
 */
export function validateId(id: unknown): boolean {
  if (typeof id !== 'string') return false
  if (id.length === 0 || id.length > 100) return false
  // Regex: apenas letras, números e hífens
  return /^[a-zA-Z0-9-]+$/.test(id)
}

/**
 * Remove caracteres de controle perigosos de uma string.
 * Mantém newline (\n, \r) e tab (\t) que são legítimos em texto.
 * Remove null bytes, backspace, etc. que podem causar problemas.
 */
export function sanitizeString(input: string): string {
  // [\x00-\x08]: null a backspace
  // [\x0B]: vertical tab
  // [\x0C]: form feed
  // [\x0E-\x1F]: shift out a unit separator
  // [\x7F]: delete
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}
