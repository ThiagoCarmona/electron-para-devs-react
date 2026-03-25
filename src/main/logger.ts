/**
 * logger.ts — Sistema de logging com níveis e saída dual (console + arquivo)
 *
 * Por que um logger customizado?
 * Em produção, console.log() se perde — o usuário não vê o terminal.
 * Com este logger, os logs também são gravados em arquivo, permitindo
 * diagnóstico de problemas mesmo após o app ter fechado.
 *
 * Conceitos implementados:
 * 1. Níveis de log: debug < info < warn < error
 *    - Em dev: nível "debug" (mostra tudo)
 *    - Em prod: nível "info" (esconde debug)
 *
 * 2. Saída dual:
 *    - Console: para desenvolvimento (visível no terminal/DevTools)
 *    - Arquivo: para produção (salvo em userData/logs/YYYY-MM-DD.log)
 *
 * 3. Formato estruturado:
 *    [timestamp] [LEVEL] [context] message {data}
 *    Ex.: [2024-01-15T10:30:00.000Z] [ERROR] [ipc] Validação falhou {"error": "..."}
 *
 * 4. Lazy initialization: o caminho do arquivo só é resolvido quando necessário
 *    (app.getPath() só funciona após app.whenReady())
 */

import { app } from 'electron'
import { join } from 'path'
import { appendFileSync, existsSync, mkdirSync } from 'fs'

// Ordem dos níveis: debug(0) < info(1) < warn(2) < error(3)
// Se currentLevel = 'info', só info, warn e error são logados
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
type LogLevel = (typeof LOG_LEVELS)[number]

// Lazy init: só calculado na primeira escrita (após app.whenReady)
let logFilePath: string | null = null
let currentLevel: LogLevel = 'info'

/**
 * Resolve o caminho do arquivo de log.
 * Usa app.getPath('userData') que aponta para:
 * - Windows: %APPDATA%/electron-notas/logs/
 * - macOS: ~/Library/Application Support/electron-notas/logs/
 * - Linux: ~/.config/electron-notas/logs/
 */
function getLogFilePath(): string {
  if (logFilePath) return logFilePath

  const logDir = join(app.getPath('userData'), 'logs')
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true })
  }

  // Um arquivo por dia (ex.: 2024-01-15.log)
  const date = new Date().toISOString().split('T')[0]
  logFilePath = join(logDir, `${date}.log`)
  return logFilePath
}

/**
 * Verifica se o nível deve ser logado.
 * Compara índices: debug(0) < info(1) < warn(2) < error(3)
 * Se currentLevel = 'warn', só warn(2) e error(3) passam.
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(currentLevel)
}

/** Formata a mensagem com timestamp ISO, nível e contexto */
function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`
}

/** Define o nível mínimo de log */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

/**
 * Função principal de log.
 * @param level - Nível: 'debug' | 'info' | 'warn' | 'error'
 * @param context - De onde vem o log: 'app', 'ipc', 'security', etc.
 * @param message - Mensagem descritiva
 * @param data - Dados extras (serializados como JSON)
 */
export function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return

  const formatted = formatMessage(level, context, message)
  const fullMessage = data ? `${formatted} ${JSON.stringify(data)}` : formatted

  // Saída 1: Console (visível em dev)
  switch (level) {
    case 'error':
      console.error(fullMessage)
      break
    case 'warn':
      console.warn(fullMessage)
      break
    default:
      console.log(fullMessage)
  }

  // Saída 2: Arquivo (persiste após fechar o app)
  // Só escreve após app.isReady() para que getPath() funcione
  try {
    if (app.isReady()) {
      appendFileSync(getLogFilePath(), fullMessage + '\n', 'utf-8')
    }
  } catch {
    // Silencia erros de escrita (ex.: disco cheio, permissão negada)
    // Não podemos logar o erro de log — causaria recursão infinita!
  }
}

// Atalhos para cada nível (facilita o uso: logger.info('ctx', 'msg') )
export const logger = {
  debug: (ctx: string, msg: string, data?: unknown): void => log('debug', ctx, msg, data),
  info: (ctx: string, msg: string, data?: unknown): void => log('info', ctx, msg, data),
  warn: (ctx: string, msg: string, data?: unknown): void => log('warn', ctx, msg, data),
  error: (ctx: string, msg: string, data?: unknown): void => log('error', ctx, msg, data)
}
