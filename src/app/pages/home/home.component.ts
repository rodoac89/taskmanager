import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

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

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
