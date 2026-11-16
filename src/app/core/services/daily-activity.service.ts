import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type ActivityKind = 'water' | 'steps';

export interface ActivityRecord {
  id: string;
  kind: ActivityKind;
  amount: number;
  date: string;
}

export interface DailySummary {
  date: string;
  waterMl: number;
  steps: number;
}

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class DailyActivityService {
  private readonly auth = inject(AuthService);
  private readonly revision = signal(0);

  readonly today = signal(localDateKey());

  private accountKey(prefix: string): string | null {
    const email = this.auth.currentUser()?.email?.trim().toLowerCase();
    return email ? `${prefix}_${email}` : null;
  }

  private readRecords(key: string): ActivityRecord[] {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (!Array.isArray(parsed)) return [];

      return parsed.filter((item): item is ActivityRecord =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        (item.kind === 'water' || item.kind === 'steps') &&
        typeof item.amount === 'number' &&
        Number.isFinite(item.amount) &&
        item.amount > 0 &&
        typeof item.date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date)
      );
    } catch {
      return [];
    }
  }

  readonly records = computed(() => {
    this.revision();
    const key = this.accountKey('nutrit_daily_activity');
    return key ? this.readRecords(key) : [];
  });

  readonly todayRecords = computed(() =>
    this.records().filter(record => record.date === this.today())
  );

  readonly waterMl = computed(() =>
    this.todayRecords()
      .filter(record => record.kind === 'water')
      .reduce((total, record) => total + record.amount, 0)
  );

  readonly steps = computed(() =>
    this.todayRecords()
      .filter(record => record.kind === 'steps')
      .reduce((total, record) => total + record.amount, 0)
  );

  readonly waterGoalMl = computed<number | null>(() => {
    const glasses = this.auth.currentUser()?.habits?.waterGlasses;
    return typeof glasses === 'number' && glasses > 0 ? glasses * 250 : null;
  });

  readonly stepsGoal = computed<number | null>(() => {
    this.revision();
    const key = this.accountKey('nutrit_steps_goal');
    if (!key) return null;

    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      const goal = Number(raw);
      return Number.isInteger(goal) && goal >= 1 && goal <= 100000 ? goal : null;
    } catch {
      return null;
    }
  });

  readonly waterProgress = computed(() => {
    const goal = this.waterGoalMl();
    return goal ? Math.min(100, (this.waterMl() / goal) * 100) : 0;
  });

  readonly stepsProgress = computed(() => {
    const goal = this.stepsGoal();
    return goal ? Math.min(100, (this.steps() / goal) * 100) : 0;
  });

  refreshToday(): void {
    this.today.set(localDateKey());
  }

  addRecord(kind: ActivityKind, amount: number): boolean {
    this.refreshToday();

    const maxAmount = kind === 'water' ? 5000 : 100000;
    const key = this.accountKey('nutrit_daily_activity');
    if (!key || !Number.isInteger(amount) || amount <= 0 || amount > maxAmount) {
      return false;
    }

    try {
      const record: ActivityRecord = {
        id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        kind,
        amount,
        date: this.today()
      };
      localStorage.setItem(key, JSON.stringify([...this.readRecords(key), record]));
      this.revision.update(value => value + 1);
      return true;
    } catch {
      return false;
    }
  }

  deleteRecord(id: string): void {
    const key = this.accountKey('nutrit_daily_activity');
    if (!key) return;

    try {
      localStorage.setItem(
        key,
        JSON.stringify(this.readRecords(key).filter(record => record.id !== id))
      );
      this.revision.update(value => value + 1);
    } catch {
      // Mantener la vista actual si el navegador no permite escribir en localStorage.
    }
  }

  setStepsGoal(goal: number): boolean {
    const key = this.accountKey('nutrit_steps_goal');
    if (!key || !Number.isInteger(goal) || goal < 1 || goal > 100000) return false;

    try {
      localStorage.setItem(key, String(goal));
      this.revision.update(value => value + 1);
      return true;
    } catch {
      return false;
    }
  }

  readonly lastSevenDays = computed<DailySummary[]>(() => {
    const [year, month, day] = this.today().split('-').map(Number);
    const records = this.records();
    const result: DailySummary[] = [];

    for (let offset = 6; offset >= 0; offset--) {
      const date = localDateKey(new Date(year, month - 1, day - offset, 12));
      const dailyRecords = records.filter(record => record.date === date);
      result.push({
        date,
        waterMl: dailyRecords
          .filter(record => record.kind === 'water')
          .reduce((total, record) => total + record.amount, 0),
        steps: dailyRecords
          .filter(record => record.kind === 'steps')
          .reduce((total, record) => total + record.amount, 0)
      });
    }

    return result;
  });
}
