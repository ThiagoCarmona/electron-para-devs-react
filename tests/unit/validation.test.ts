/**
 * validation.test.ts — Testes unitários para validação de input
 *
 * Framework: Vitest (API compatível com Jest)
 *
 * Padrão usado: AAA (Arrange, Act, Assert)
 * - Arrange: prepara os dados de entrada
 * - Act: chama a função sendo testada
 * - Assert: verifica o resultado com expect()
 *
 * Estrutura:
 * - describe(): agrupa testes relacionados
 * - it(): define um caso de teste individual
 * - expect(): verifica o resultado
 *
 * Para rodar: npx vitest (watch mode) ou npx vitest run (CI)
 */

import { describe, it, expect } from 'vitest'
import { validateNoteInput, validateId, sanitizeString } from '../../src/main/validation'

describe('validateNoteInput', () => {
  // Testes de "caminho feliz" (happy path) — inputs válidos
  it('aceita título e conteúdo válidos', () => {
    const result = validateNoteInput('Minha nota', 'Conteúdo da nota')
    expect(result.valid).toBe(true)
  })

  it('aceita strings vazias', () => {
    // Strings vazias são válidas (usuário pode criar nota em branco)
    const result = validateNoteInput('', '')
    expect(result.valid).toBe(true)
  })

  // Testes de tipo — garante que a validação rejeita tipos errados
  it('rejeita título não-string', () => {
    const result = validateNoteInput(123, 'conteúdo')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('string') // Verifica que o erro menciona "string"
  })

  it('rejeita conteúdo não-string', () => {
    const result = validateNoteInput('título', null)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('string')
  })

  // Testes de limite — verifica os limites de tamanho
  it('rejeita título muito longo', () => {
    const longTitle = 'a'.repeat(201) // 1 caractere acima do limite
    const result = validateNoteInput(longTitle, 'conteúdo')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('200')
  })

  it('rejeita conteúdo muito longo', () => {
    const longContent = 'a'.repeat(100_001) // 100k+1 caracteres
    const result = validateNoteInput('título', longContent)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('100000')
  })
})

describe('validateId', () => {
  // IDs válidos: UUID e alfanuméricos com hífens
  it('aceita UUID v4', () => {
    expect(validateId('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('aceita string alfanumérica', () => {
    expect(validateId('abc-123-def')).toBe(true)
  })

  // IDs inválidos
  it('rejeita string vazia', () => {
    expect(validateId('')).toBe(false)
  })

  it('rejeita não-string', () => {
    expect(validateId(42)).toBe(false)
    expect(validateId(null)).toBe(false)
    expect(validateId(undefined)).toBe(false)
  })

  // Testes de segurança — verifica que inputs maliciosos são rejeitados
  it('rejeita caracteres especiais (prevenção de injeção)', () => {
    expect(validateId('id; DROP TABLE notes')).toBe(false)  // SQL injection
    expect(validateId('../etc/passwd')).toBe(false)          // Path traversal
  })
})

describe('sanitizeString', () => {
  it('mantém texto normal', () => {
    expect(sanitizeString('Hello World')).toBe('Hello World')
  })

  it('mantém newlines e tabs (são legítimos em texto)', () => {
    expect(sanitizeString('linha1\nlinha2\ttab')).toBe('linha1\nlinha2\ttab')
  })

  it('remove caracteres de controle perigosos', () => {
    expect(sanitizeString('hello\x00world')).toBe('helloworld') // null byte
    expect(sanitizeString('test\x07beep')).toBe('testbeep')     // bell
  })

  it('mantém acentos e emojis (Unicode)', () => {
    expect(sanitizeString('café ☕ ação')).toBe('café ☕ ação')
  })
})
