import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimelineComponent } from '../../timeline/timeline.component';
import { TimelineEvent } from '../../timeline/timeline.interface';
import { TaskService } from '../../services/task.service';
import { ExcelService } from '../../services/excel.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-timeline-view',
  imports: [CommonModule, TimelineComponent],
  templateUrl: './timeline-view.component.html',
  styleUrl: './timeline-view.component.css'
})
export class TimelineViewComponent {
  private taskService = inject(TaskService);
  private excelService = inject(ExcelService);
  private router = inject(Router);

  orientation = signal<'vertical' | 'horizontal'>('vertical');

  timelineEvents = computed<TimelineEvent[]>(() => {
    return this.taskService.tasks().map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.startDate,
      icon: this.getIconForStatus(task.status),
      color: this.getColorForPriority(task.priority),
      completed: task.status === 'completed'
    }));
  });

  toggleOrientation(): void {
    this.orientation.update(o => o === 'vertical' ? 'horizontal' : 'vertical');
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

  private getIconForStatus(status: string): string {
    const icons: Record<string, string> = {
      'completed': '✅',
      'in-progress': '🔄',
      'pending': '⏳'
    };
    return icons[status] || '📌';
  }

  private getColorForPriority(priority: string): string {
    const colors: Record<string, string> = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority] || '#3b82f6';
  }
}
