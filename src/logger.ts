export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (level < this.logLevel) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    const levelName = LogLevel[level];
    const emoji = this.getLevelEmoji(level);
    
    if (data) {
      console.log(`${emoji} [${entry.timestamp}] ${levelName}: ${message}`, data);
    } else {
      console.log(`${emoji} [${entry.timestamp}] ${levelName}: ${message}`);
    }
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      default: return '📝';
    }
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  success(message: string, data?: any): void {
    console.log(`✅ [${new Date().toISOString()}] SUCCESS: ${message}`, data || '');
  }

  skip(message: string, data?: any): void {
    console.log(`🔄 [${new Date().toISOString()}] SKIP: ${message}`, data || '');
  }
}

export const logger = new Logger(); 