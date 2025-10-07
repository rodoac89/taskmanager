import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ExcelService } from '../../services/excel.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-kanban-view',
  imports: [CommonModule],
  templateUrl: './kanban-view.component.html',
  styleUrl: './kanban-view.component.css'
})
export class KanbanViewComponent {
  private taskService = inject(TaskService);
  private excelService = inject(ExcelService);
  private router = inject(Router);

  pendingTasks = computed(() =>
    this.taskService.tasks().filter(t => t.status === 'pending')
  );

  inProgressTasks = computed(() =>
    this.taskService.tasks().filter(t => t.status === 'in-progress')
  );

  completedTasks = computed(() =>
    this.taskService.tasks().filter(t => t.status === 'completed')
  );

  totalTasks = computed(() => this.taskService.tasks().length);

  highPriorityTasks = computed(() =>
    this.taskService.tasks().filter(t => t.priority === 'high').length
  );

  overallProgress = computed(() => {
    const tasks = this.taskService.tasks();
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    return Math.round(totalProgress / tasks.length);
  });

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

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || '#3b82f6';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'high': 'Alta',
      'medium': 'Media',
      'low': 'Baja'
    };
    return labels[priority] || priority;
  }

  formatDateRange(task: Task): string {
    const start = task.startDate;
    const end = task.endDate;
    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = start.toLocaleDateString('es-ES', { month: 'short' });
    return `${startDay}-${endDay} ${month}`;
  }

  getWeekLabel(task: Task): string {
    const weekNum = this.getWeekNumber(task.startDate);
    return `Semana ${weekNum}`;
  }

  private getWeekNumber(date: Date): number {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const millisecsInDay = 86400000;
    return Math.ceil((((date.getTime() - onejan.getTime()) / millisecsInDay) + onejan.getDay() + 1) / 7);
  }

  getSubtaskCount(task: Task): number {
    // Simulamos subtareas basadas en el progreso
    return Math.ceil((task.progress || 0) / 20);
  }
}
