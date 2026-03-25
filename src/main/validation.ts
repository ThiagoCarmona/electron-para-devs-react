// Validação de inputs no main process
// Nunca confie nos dados vindos do renderer

const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 100_000

interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateNoteInput(title: unknown, content: unknown): ValidationResult {
  if (typeof title !== 'string') {
    return { valid: false, error: 'Título deve ser uma string' }
  }

  if (typeof content !== 'string') {
    return { valid: false, error: 'Conteúdo deve ser uma string' }
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Título não pode ter mais de ${MAX_TITLE_LENGTH} caracteres` }
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `Conteúdo não pode ter mais de ${MAX_CONTENT_LENGTH} caracteres` }
  }

  return { valid: true }
}

export function validateId(id: unknown): boolean {
  if (typeof id !== 'string') return false
  if (id.length === 0 || id.length > 100) return false
  // UUID v4 ou string alfanumérica com hífens
  return /^[a-zA-Z0-9-]+$/.test(id)
}

export function sanitizeString(input: string): string {
  // Remove caracteres de controle (exceto newline e tab)
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}
