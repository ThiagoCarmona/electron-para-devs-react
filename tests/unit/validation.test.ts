import { describe, it, expect } from 'vitest'
import { validateNoteInput, validateId, sanitizeString } from '../../src/main/validation'

describe('validateNoteInput', () => {
  it('aceita título e conteúdo válidos', () => {
    const result = validateNoteInput('Minha nota', 'Conteúdo da nota')
    expect(result.valid).toBe(true)
  })

  it('aceita strings vazias', () => {
    const result = validateNoteInput('', '')
    expect(result.valid).toBe(true)
  })

  it('rejeita título não-string', () => {
    const result = validateNoteInput(123, 'conteúdo')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('string')
  })

  it('rejeita conteúdo não-string', () => {
    const result = validateNoteInput('título', null)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('string')
  })

  it('rejeita título muito longo', () => {
    const longTitle = 'a'.repeat(201)
    const result = validateNoteInput(longTitle, 'conteúdo')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('200')
  })

  it('rejeita conteúdo muito longo', () => {
    const longContent = 'a'.repeat(100_001)
    const result = validateNoteInput('título', longContent)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('100000')
  })
})

describe('validateId', () => {
  it('aceita UUID v4', () => {
    expect(validateId('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('aceita string alfanumérica', () => {
    expect(validateId('abc-123-def')).toBe(true)
  })

  it('rejeita string vazia', () => {
    expect(validateId('')).toBe(false)
  })

  it('rejeita não-string', () => {
    expect(validateId(42)).toBe(false)
    expect(validateId(null)).toBe(false)
    expect(validateId(undefined)).toBe(false)
  })

  it('rejeita caracteres especiais', () => {
    expect(validateId('id; DROP TABLE notes')).toBe(false)
    expect(validateId('../etc/passwd')).toBe(false)
  })
})

describe('sanitizeString', () => {
  it('mantém texto normal', () => {
    expect(sanitizeString('Hello World')).toBe('Hello World')
  })

  it('mantém newlines e tabs', () => {
    expect(sanitizeString('linha1\nlinha2\ttab')).toBe('linha1\nlinha2\ttab')
  })

  it('remove caracteres de controle', () => {
    expect(sanitizeString('hello\x00world')).toBe('helloworld')
    expect(sanitizeString('test\x07beep')).toBe('testbeep')
  })

  it('mantém acentos e emojis', () => {
    expect(sanitizeString('café ☕ ação')).toBe('café ☕ ação')
  })
})
