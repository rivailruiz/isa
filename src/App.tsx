import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { HistoryList } from './components/HistoryList';
import { StatusCard } from './components/StatusCard';
import { formatFullDate, getLocalDateKey } from './lib/dates';
import { loadRecords, saveTodayRecord } from './lib/storage';
import type { DoseRecords, DoseStatus } from './types';

export default function App() {
  const [records, setRecords] = useState<DoseRecords>(() => loadRecords());
  const [todayKey, setTodayKey] = useState(() => getLocalDateKey());
  const todayRecord = records[todayKey];

  const todayLabel = useMemo(() => formatFullDate(), [todayKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextKey = getLocalDateKey();

      if (nextKey !== todayKey) {
        setTodayKey(nextKey);
      }
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [todayKey]);

  function registerDose(status: DoseStatus) {
    if (records[todayKey]) {
      return;
    }

    const nextRecords = saveTodayRecord(status);
    setRecords(nextRecords);
  }

  return (
    <main className="appShell">
      <header className="appHeader">
        <div className="brandMark" aria-hidden="true">
          <span className="brandEmoji">💊</span>
        </div>
        <div>
          <p>Meu Remédio</p>
          <h1>Controle diário</h1>
        </div>
      </header>

      <section className="todayBanner" aria-label="Data de hoje">
        <CalendarDays size={22} aria-hidden="true" />
        <span>{todayLabel}</span>
      </section>

      <StatusCard
        todayRecord={todayRecord}
        onTaken={() => registerDose('taken')}
        onNotTaken={() => registerDose('not_taken')}
      />

      <HistoryList records={records} />
    </main>
  );
}
