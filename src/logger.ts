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
    
    // In production, disable console logging for security
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    if (data) {
      // Sanitize data to prevent sensitive information logging
      const sanitizedData = this.sanitizeData(data);
      console.log(`${emoji} [${entry.timestamp}] ${levelName}: ${message}`, sanitizedData);
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

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Check if string contains sensitive patterns
      if (data.toLowerCase().includes('password') || 
          data.toLowerCase().includes('token') || 
          data.toLowerCase().includes('secret') ||
          data.toLowerCase().includes('key')) {
        return '[REDACTED]';
      }
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      for (const key in data) {
        if (key.toLowerCase().includes('password') || 
            key.toLowerCase().includes('token') || 
            key.toLowerCase().includes('secret') ||
            key.toLowerCase().includes('key') ||
            key.toLowerCase().includes('auth')) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
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
    if (process.env.NODE_ENV === 'production') return;
    const sanitizedData = data ? this.sanitizeData(data) : '';
    console.log(`✅ [${new Date().toISOString()}] SUCCESS: ${message}`, sanitizedData);
  }

  skip(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'production') return;
    const sanitizedData = data ? this.sanitizeData(data) : '';
    console.log(`🔄 [${new Date().toISOString()}] SKIP: ${message}`, sanitizedData);
  }
}

export const logger = new Logger(); 