import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ExcelService } from '../../services/excel.service';

interface BurndownPoint {
  date: Date;
  dateStr: string;
  ideal: number;
  actual: number;
  completed: number;
}

@Component({
  selector: 'app-burndown-view',
  imports: [CommonModule],
  templateUrl: './burndown-view.component.html',
  styleUrl: './burndown-view.component.css'
})
export class BurndownViewComponent {
  private taskService = inject(TaskService);
  private excelService = inject(ExcelService);
  private router = inject(Router);

  Math = Math; // Exponer Math a la plantilla

  showIdealLine = signal(true);
  showActualLine = signal(true);

  burndownData = computed<BurndownPoint[]>(() => {
    const tasks = this.taskService.tasks();
    if (tasks.length === 0) return [];

    // Encontrar fecha de inicio y fin del proyecto
    const dates = tasks.map(t => [new Date(t.startDate), new Date(t.endDate)]).flat();
    const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Total de tareas
    const totalTasks = tasks.length;

    // Generar puntos del burndown
    const points: BurndownPoint[] = [];
    const currentDate = new Date(startDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(currentDate);
      date.setDate(startDate.getDate() + i);

      // Línea ideal: decremento lineal
      const ideal = totalTasks - (totalTasks / daysDiff) * i;

      // Línea actual: contar tareas completadas hasta esta fecha
      const completedByDate = tasks.filter(t => {
        const endTaskDate = new Date(t.endDate);
        return t.status === 'completed' && endTaskDate <= date;
      }).length;

      const actual = totalTasks - completedByDate;

      points.push({
        date,
        dateStr: this.formatDate(date),
        ideal: Math.max(0, ideal),
        actual,
        completed: completedByDate
      });
    }

    return points;
  });

  stats = computed(() => {
    const tasks = this.taskService.tasks();
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return {
      total: tasks.length,
      completed,
      inProgress,
      pending,
      completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
    };
  });

  chartPoints = computed(() => {
    const data = this.burndownData();
    if (data.length === 0) return null;

    const maxTasks = Math.max(...data.map(p => Math.max(p.ideal, p.actual)));
    const chartHeight = 300;
    const chartWidth = 800;
    const padding = 40;

    const xScale = (chartWidth - padding * 2) / (data.length - 1);
    const yScale = (chartHeight - padding * 2) / maxTasks;

    // Generar línea ideal
    const idealPoints = data.map((point, i) => {
      const x = padding + i * xScale;
      const y = chartHeight - padding - point.ideal * yScale;
      return `${x},${y}`;
    }).join(' ');

    // Generar línea actual
    const actualPoints = data.map((point, i) => {
      const x = padding + i * xScale;
      const y = chartHeight - padding - point.actual * yScale;
      return `${x},${y}`;
    }).join(' ');

    return {
      ideal: idealPoints,
      actual: actualPoints,
      maxTasks,
      chartHeight,
      chartWidth,
      padding,
      xScale,
      yScale
    };
  });

  toggleIdealLine(): void {
    this.showIdealLine.update(v => !v);
  }

  toggleActualLine(): void {
    this.showActualLine.update(v => !v);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.excelService.readExcelFile(file).then(tasks => {
        this.taskService.updateTasks(tasks);
        alert(`✅ Se cargaron ${tasks.length} tareas correctamente`);
      }).catch(error => {
        alert(`❌ Error al cargar el archivo: ${error.message}`);
      });
    }
  }

  downloadExample(): void {
    this.excelService.downloadExampleExcel();
  }

  exportData(): void {
    this.excelService.exportToExcel(this.taskService.tasks());
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }
}
