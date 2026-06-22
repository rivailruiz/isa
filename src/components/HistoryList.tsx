import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import type { DoseRecords, DoseStatus } from '../types';
import { formatShortDate, getLastDateKeys } from '../lib/dates';

type HistoryListProps = {
  records: DoseRecords;
};

function getStatusLabel(status?: DoseStatus): string {
  if (status === 'taken') {
    return 'Tomado';
  }

  if (status === 'not_taken') {
    return 'Não tomado';
  }

  return 'Sem registro';
}

export function HistoryList({ records }: HistoryListProps) {
  const days = getLastDateKeys(30);

  return (
    <section className="panel" aria-labelledby="history-title">
      <div className="sectionHeader">
        <div>
          <p className="sectionEyebrow">Últimos dias</p>
          <h2 id="history-title">Histórico</h2>
        </div>
        <span className="countBadge">30 dias</span>
      </div>

      <div className="historyList">
        {days.map((dateKey) => {
          const record = records[dateKey];
          const statusClass = record?.status === 'taken' ? 'taken' : record?.status === 'not_taken' ? 'notTaken' : 'empty';
          const StatusIcon = record?.status === 'taken' ? CheckCircle2 : record?.status === 'not_taken' ? XCircle : CircleDashed;

          return (
            <article className="historyItem" key={dateKey}>
              <div className={`historyIcon ${statusClass}`} aria-hidden="true">
                <StatusIcon size={22} />
              </div>
              <div className="historyText">
                <strong>{formatShortDate(dateKey)}</strong>
                <span>{getStatusLabel(record?.status)}</span>
              </div>
              <time className="historyTime">{record?.time ?? '--:--'}</time>
            </article>
          );
        })}
      </div>
    </section>
  );
}
