import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ExcelService } from '../../services/excel.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-gantt-view',
  imports: [CommonModule],
  templateUrl: './gantt-view.component.html',
  styleUrl: './gantt-view.component.css'
})
export class GanttViewComponent {
  private taskService = inject(TaskService);
  private excelService = inject(ExcelService);
  private router = inject(Router);

  tasks = this.taskService.tasks;

  // Calcular rango de fechas para el gráfico
  dateRange = computed(() => {
    const tasks = this.tasks();
    if (tasks.length === 0) return { start: new Date(), end: new Date(), months: [] };

    const dates = tasks.flatMap(t => [t.startDate, t.endDate]);
    const start = new Date(Math.min(...dates.map(d => d.getTime())));
    const end = new Date(Math.max(...dates.map(d => d.getTime())));

    // Generar array de meses
    const months: Date[] = [];
    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endDate = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= endDate) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return { start, end, months };
  });

  getTaskPosition(task: Task): { left: number; width: number } {
    const range = this.dateRange();
    const totalDays = this.getDaysDifference(range.start, range.end);
    const taskStart = this.getDaysDifference(range.start, task.startDate);
    const taskDuration = this.getDaysDifference(task.startDate, task.endDate);

    return {
      left: (taskStart / totalDays) * 100,
      width: (taskDuration / totalDays) * 100
    };
  }

  private getDaysDifference(start: Date, end: Date): number {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
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

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'completed': '#10b981',
      'in-progress': '#3b82f6',
      'pending': '#9ca3af'
    };
    return colors[status] || '#3b82f6';
  }
}
