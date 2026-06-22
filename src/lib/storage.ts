import type { DoseRecord, DoseRecords, DoseStatus } from '../types';
import { getLocalDateKey, getLocalTime } from './dates';

const RECORDS_KEY = 'medicine-dose-records-v2';

export function loadRecords(): DoseRecords {
  const rawRecords = localStorage.getItem(RECORDS_KEY);

  if (!rawRecords) {
    return {};
  }

  try {
    const records = JSON.parse(rawRecords) as DoseRecords;
    return records && typeof records === 'object' ? records : {};
  } catch {
    return {};
  }
}

export function saveRecords(records: DoseRecords): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function createTodayRecord(status: DoseStatus): DoseRecord {
  const now = new Date();

  return {
    status,
    time: getLocalTime(now),
    timestamp: now.toISOString()
  };
}

export function saveTodayRecord(status: DoseStatus): DoseRecords {
  const dateKey = getLocalDateKey();
  const records = loadRecords();

  if (records[dateKey]) {
    return records;
  }

  const nextRecords = {
    ...records,
    [dateKey]: createTodayRecord(status)
  };

  saveRecords(nextRecords);
  return nextRecords;
}
