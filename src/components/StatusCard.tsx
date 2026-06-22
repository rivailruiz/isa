import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import type { DoseRecord } from '../types';

type StatusCardProps = {
  todayRecord?: DoseRecord;
  onTaken: () => void;
  onNotTaken: () => void;
};

export function StatusCard({ todayRecord, onTaken, onNotTaken }: StatusCardProps) {
  const isTaken = todayRecord?.status === 'taken';
  const isNotTaken = todayRecord?.status === 'not_taken';
  const isLocked = Boolean(todayRecord);
  const cardClassName = isTaken ? 'statusCard taken' : isNotTaken ? 'statusCard notTaken' : 'statusCard pending';
  const title = isTaken ? 'Remédio tomado' : isNotTaken ? 'Não tomei hoje' : 'Ainda não tomei';
  const description = isTaken
    ? `Registrado às ${todayRecord.time}`
    : isNotTaken
      ? `Marcado às ${todayRecord.time}`
      : 'Registre sua dose diária com um toque.';
  const Icon = isTaken ? CheckCircle2 : isNotTaken ? XCircle : Clock3;

  return (
    <section className={cardClassName} aria-live="polite">
      <div className="statusIcon" aria-hidden="true">
        <Icon size={44} strokeWidth={2.3} />
      </div>

      <div>
        <p className="statusEyebrow">Status de hoje</p>
        <h2>{title}</h2>
        <p className="statusDescription">{description}</p>
      </div>

      <div className="actionStack">
        <button className="primaryButton" type="button" onClick={onTaken} disabled={isLocked}>
          <CheckCircle2 size={24} aria-hidden="true" />
          <span>Marcar como tomado</span>
        </button>
        <button className="secondaryButton" type="button" onClick={onNotTaken} disabled={isLocked}>
          <XCircle size={24} aria-hidden="true" />
          <span>Marcar como não tomado</span>
        </button>
      </div>

      {isLocked ? <p className="lockedNotice">Dose já registrada hoje.</p> : null}
    </section>
  );
}
