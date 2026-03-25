import { app } from 'electron'
import { join } from 'path'
import { appendFileSync, existsSync, mkdirSync } from 'fs'

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const
type LogLevel = (typeof LOG_LEVELS)[number]

let logFilePath: string | null = null
let currentLevel: LogLevel = 'info'

function getLogFilePath(): string {
  if (logFilePath) return logFilePath

  const logDir = join(app.getPath('userData'), 'logs')
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true })
  }

  const date = new Date().toISOString().split('T')[0]
  logFilePath = join(logDir, `${date}.log`)
  return logFilePath
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(currentLevel)
}

function formatMessage(level: LogLevel, context: string, message: string): string {
  const timestamp = new Date().toISOString()
  return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`
}

export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

export function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return

  const formatted = formatMessage(level, context, message)
  const fullMessage = data ? `${formatted} ${JSON.stringify(data)}` : formatted

  // Console
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

  // Arquivo (só após o app estar pronto)
  try {
    if (app.isReady()) {
      appendFileSync(getLogFilePath(), fullMessage + '\n', 'utf-8')
    }
  } catch {
    // Silencia erros de escrita no log
  }
}

// Atalhos
export const logger = {
  debug: (ctx: string, msg: string, data?: unknown): void => log('debug', ctx, msg, data),
  info: (ctx: string, msg: string, data?: unknown): void => log('info', ctx, msg, data),
  warn: (ctx: string, msg: string, data?: unknown): void => log('warn', ctx, msg, data),
  error: (ctx: string, msg: string, data?: unknown): void => log('error', ctx, msg, data)
}
