export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = context ? `${message} ${JSON.stringify(context)}` : message
  if (level === 'error') {
    console.error(payload)
    return
  }
  if (level === 'warn') {
    console.warn(payload)
    return
  }
  console.log(payload)
}
