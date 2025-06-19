import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export interface TimeConfig {
  minEntranceHour: number;
  minEntranceMinute: number;
  maxEntranceHour: number;
  maxEntranceMinute: number;
  minWorkHours: number;
  maxWorkHours: number;
}

export interface AppConfig {
  email: string;
  password: string;
  baseUrl: string;
  timeouts: {
    login: number;
    navigation: number;
    element: number;
  };
  time: TimeConfig;
}

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value.trim();
}

function getEnvNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  if (isNaN(num)) {
    throw new Error(`Environment variable ${name} must be a valid number, got: ${value}`);
  }
  return num;
}

export const config: AppConfig = {
  email: validateEnvVar('MECKANO_EMAIL', process.env.MECKANO_EMAIL),
  password: validateEnvVar('MECKANO_PASSWORD', process.env.MECKANO_PASSWORD),
  baseUrl: 'https://app.meckano.co.il',
  timeouts: {
    login: 120000, // 2 minutes
    navigation: 20000, // 20 seconds
    element: 15000, // 15 seconds
  },
  time: {
    minEntranceHour: getEnvNumber('MIN_ENTRANCE_HOUR', 7),
    minEntranceMinute: getEnvNumber('MIN_ENTRANCE_MINUTE', 45),
    maxEntranceHour: getEnvNumber('MAX_ENTRANCE_HOUR', 9),
    maxEntranceMinute: getEnvNumber('MAX_ENTRANCE_MINUTE', 30),
    minWorkHours: getEnvNumber('MIN_WORK_HOURS', 9),
    maxWorkHours: getEnvNumber('MAX_WORK_HOURS', 10),
  },
}; 