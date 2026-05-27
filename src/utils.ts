import type { TaskData, TimelineItem } from './types';

export function calculateLiquidTimeline(tasks: TaskData[], startTime: Date, deadline: Date): TimelineItem[] {
  const totalMin = (deadline.getTime() - startTime.getTime()) / 60000;
  if (totalMin <= 0) return [];
  let remaining = totalMin;
  const durMap = new Map<string, number>();

  for (const t of tasks) {
    if (t.isFixedDuration && t.fixedDuration && t.fixedDuration > 0) {
      durMap.set(t.id, t.fixedDuration);
      remaining -= t.fixedDuration;
    }
  }

  const elastic = tasks.filter(t => !(t.isFixedDuration && t.fixedDuration && t.fixedDuration > 0));
  if (elastic.length && remaining > 0) {
    const tw = elastic.reduce((s, t) => s + t.weight, 0) || 1;
    for (const t of elastic) {
      let d = (t.weight / tw) * remaining;
      if (t.maxDuration && d > t.maxDuration) d = t.maxDuration;
      durMap.set(t.id, d);
    }
  }

  let cur = startTime.getTime();
  const tl: TimelineItem[] = [];
  for (const t of tasks) {
    const dur = durMap.get(t.id) || 0;
    const end = new Date(cur + dur * 60000);
    tl.push({
      id: t.id,
      startTime: new Date(cur).toISOString(),
      endTime: end.toISOString(),
      calculatedDuration: dur,
    });
    cur = end.getTime();
  }
  return tl;
}

export function formatAge(createdAtIso: string, now: number = Date.now()): string {
  const diff = now - new Date(createdAtIso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function formatCountdown(diffMs: number): string {
  const isPast = diffMs < 0;
  const abs = Math.abs(diffMs);
  const totalSecs = Math.floor(abs / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  let str = '';
  if (days > 0) str += `${days}d `;
  if (hours > 0) str += `${hours}h `;
  str += `${mins}m ${secs}s`;
  return isPast ? `overdue by ${str}` : str;
}

export function deadlineHue(remainingMs: number): string {
  if (remainingMs < 0) return 'hsl(300, 60%, 85%)';   // purple — overdue
  const days = remainingMs / 86400000;
  if (days > 30) return 'hsl(210, 60%, 85%)';          // blue
  if (days >= 7) return 'hsl(180, 60%, 85%)';           // cyan/green
  if (days >= 3) return 'hsl(60, 70%, 85%)';            // yellow
  if (days >= 1) return 'hsl(30, 90%, 80%)';            // orange
  return 'hsl(0, 90%, 80%)';                            // red (<1 day)
}

export function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toISOString().slice(0, 10) : '';
}

export function fmtTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function fmtDur(m: number): string {
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}
