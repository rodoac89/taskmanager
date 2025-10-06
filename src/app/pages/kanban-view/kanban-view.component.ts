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
}
