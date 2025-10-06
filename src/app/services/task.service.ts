import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksSignal = signal<Task[]>(this.getDefaultTasks());

  tasks = this.tasksSignal.asReadonly();

  updateTasks(tasks: Task[]): void {
    this.tasksSignal.set(tasks);
  }

  addTask(task: Task): void {
    this.tasksSignal.update(tasks => [...tasks, task]);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasksSignal.update(tasks =>
      tasks.map(task => task.id === id ? { ...task, ...updates } : task)
    );
  }

  deleteTask(id: string): void {
    this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
  }

  private getDefaultTasks(): Task[] {
    return [
      {
        id: '1',
        title: 'Planificación del Proyecto',
        description: 'Definir alcance y objetivos del proyecto',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-20'),
        status: 'completed',
        priority: 'high',
        assignee: 'Juan Pérez',
        progress: 100
      },
      {
        id: '2',
        title: 'Diseño de UI/UX',
        description: 'Crear mockups y prototipos de la interfaz',
        startDate: new Date('2025-01-21'),
        endDate: new Date('2025-02-10'),
        status: 'in-progress',
        priority: 'high',
        assignee: 'María García',
        progress: 65
      },
      {
        id: '3',
        title: 'Desarrollo Backend',
        description: 'Implementar APIs y servicios del servidor',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-03-15'),
        status: 'in-progress',
        priority: 'high',
        assignee: 'Carlos López',
        progress: 40
      },
      {
        id: '4',
        title: 'Desarrollo Frontend',
        description: 'Implementar componentes de la interfaz',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-03-20'),
        status: 'pending',
        priority: 'medium',
        assignee: 'Ana Martínez',
        progress: 0
      },
      {
        id: '5',
        title: 'Pruebas de Usuario',
        description: 'Realizar testing con usuarios reales',
        startDate: new Date('2025-03-21'),
        endDate: new Date('2025-04-05'),
        status: 'pending',
        priority: 'medium',
        assignee: 'Pedro Sánchez',
        progress: 0
      },
      {
        id: '6',
        title: 'Lanzamiento',
        description: 'Despliegue en producción',
        startDate: new Date('2025-04-06'),
        endDate: new Date('2025-04-10'),
        status: 'pending',
        priority: 'high',
        assignee: 'Equipo Completo',
        progress: 0
      }
    ];
  }
}
