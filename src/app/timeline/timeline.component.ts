import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from './timeline.interface';

interface GroupedPeriod {
  period: string;
  count: number;
  status: 'completed' | 'in-progress' | 'pending';
  events: TimelineEvent[];
}

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  events = input.required<TimelineEvent[]>();
  orientation = input<'vertical' | 'horizontal'>('vertical');

  groupedEvents = computed<GroupedPeriod[]>(() => {
    const events = this.events();

    // Agrupar por semanas
    const groups = new Map<string, TimelineEvent[]>();

    events.forEach(event => {
      const date = new Date(event.date);
      const weekNumber = this.getWeekNumber(date);
      const month = date.toLocaleDateString('es-ES', { month: 'short' });
      const startOfWeek = this.getStartOfWeek(date);
      const endOfWeek = this.getEndOfWeek(date);

      const periodKey = `Semana ${weekNumber}: ${startOfWeek.getDate()}-${endOfWeek.getDate()} ${month}`;

      if (!groups.has(periodKey)) {
        groups.set(periodKey, []);
      }
      groups.get(periodKey)!.push(event);
    });

    // Convertir a array y determinar el estado de cada grupo
    return Array.from(groups.entries()).map(([period, groupEvents]) => {
      const completedCount = groupEvents.filter(e => e.completed).length;
      const totalCount = groupEvents.length;

      let status: 'completed' | 'in-progress' | 'pending';
      if (completedCount === totalCount) {
        status = 'completed';
      } else if (completedCount > 0) {
        status = 'in-progress';
      } else {
        status = 'pending';
      }

      return {
        period,
        count: totalCount,
        status,
        events: groupEvents
      };
    }).sort((a, b) => {
      // Ordenar por fecha del primer evento
      return new Date(a.events[0].date).getTime() - new Date(b.events[0].date).getTime();
    });
  });

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'completed': 'Completada',
      'in-progress': 'En progreso',
      'pending': 'No iniciada'
    };
    return labels[status] || status;
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar cuando es domingo
    return new Date(d.setDate(diff));
  }

  private getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  }
}
