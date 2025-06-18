import { TimeConfig } from './config';

export interface TimeEntry {
  entrance: string;
  exit: string;
}

/**
 * Generates a random entrance time based on configuration
 */
export function getRandomEntranceTime(timeConfig: TimeConfig): string {
  const startMinutes = timeConfig.minEntranceHour * 60 + timeConfig.minEntranceMinute;
  const endMinutes = timeConfig.maxEntranceHour * 60 + timeConfig.maxEntranceMinute;
  const randomMinutes = startMinutes + Math.floor(Math.random() * (endMinutes - startMinutes));

  const hours = Math.floor(randomMinutes / 60);
  const minutes = randomMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Calculates exit time based on entrance time and work hours configuration
 */
export function getExitTime(entrance: string, timeConfig: TimeConfig): string {
  const [hours, minutes] = entrance.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  // Add random number of minutes between min and max work hours
  const minMinutes = timeConfig.minWorkHours * 60;
  const maxMinutes = timeConfig.maxWorkHours * 60;
  const extraMinutes = minMinutes + Math.floor(Math.random() * (maxMinutes - minMinutes + 1));
  
  date.setMinutes(date.getMinutes() + extraMinutes);

  return date.toTimeString().slice(0, 5);
}

/**
 * Generates a complete time entry (entrance and exit)
 */
export function generateTimeEntry(timeConfig: TimeConfig): TimeEntry {
  const entrance = getRandomEntranceTime(timeConfig);
  const exit = getExitTime(entrance, timeConfig);
  return { entrance, exit };
}

/**
 * Validates time format (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
} 