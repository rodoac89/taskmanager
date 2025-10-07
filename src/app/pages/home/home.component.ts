import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../services/excel.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);
  private excelService = inject(ExcelService);
  private taskService = inject(TaskService);

  loadingFile = signal(false);
  loadedFileName = signal('');
  taskCount = signal(0);

  viewOptions = [
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Vista de línea de tiempo vertical y horizontal',
      icon: '📅',
      color: '#3b82f6',
      route: '/timeline'
    },
    {
      id: 'kanban',
      title: 'Kanban',
      description: 'Tablero Kanban con columnas por estado',
      icon: '📋',
      color: '#8b5cf6',
      route: '/kanban'
    },
    {
      id: 'gantt',
      title: 'Gantt',
      description: 'Diagrama de Gantt para planificación',
      icon: '📊',
      color: '#10b981',
      route: '/gantt'
    }
  ];

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.loadingFile.set(true);
      this.loadedFileName.set('');

      try {
        const tasks = await this.excelService.readExcelFile(file);
        this.taskService.updateTasks(tasks);
        this.loadedFileName.set(file.name);
        this.taskCount.set(tasks.length);

        // Opcional: navegar automáticamente a una vista
        setTimeout(() => {
          this.router.navigate(['/timeline']);
        }, 1500);
      } catch (error: any) {
        alert(`❌ Error al cargar el archivo: ${error.message}`);
      } finally {
        this.loadingFile.set(false);
      }
    }
  }

  downloadExample(): void {
    this.excelService.downloadExampleExcel();
  }
}
