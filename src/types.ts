export type DoseStatus = 'taken' | 'not_taken';

export type DoseRecord = {
  status: DoseStatus;
  time: string;
  timestamp: string;
};

export type DoseRecords = Record<string, DoseRecord>;
