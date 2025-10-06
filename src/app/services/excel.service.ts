import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  // Generar un Excel de ejemplo para descargar
  downloadExampleExcel(): void {
    const exampleData = this.getExampleData();
    const csv = this.convertToCSV(exampleData);
    this.downloadCSV(csv, 'plantilla-tareas.csv');
  }

  // Leer archivo Excel/CSV cargado
  async readExcelFile(file: File): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const text = e.target.result;
          const tasks = this.parseCSV(text);
          resolve(tasks);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  }

  // Exportar datos actuales a Excel
  exportToExcel(tasks: Task[], filename: string = 'tareas-export.csv'): void {
    const data = tasks.map(task => ({
      'ID': task.id,
      'Título': task.title,
      'Descripción': task.description,
      'Fecha Inicio': this.formatDate(task.startDate),
      'Fecha Fin': this.formatDate(task.endDate),
      'Estado': this.translateStatus(task.status),
      'Prioridad': this.translatePriority(task.priority),
      'Asignado': task.assignee || '',
      'Progreso (%)': task.progress || 0
    }));

    const csv = this.convertToCSV(data);
    this.downloadCSV(csv, filename);
  }

  private getExampleData() {
    return [
      {
        'ID': '1',
        'Título': 'Planificación del Proyecto',
        'Descripción': 'Definir alcance y objetivos del proyecto',
        'Fecha Inicio': '2025-01-15',
        'Fecha Fin': '2025-01-20',
        'Estado': 'Completado',
        'Prioridad': 'Alta',
        'Asignado': 'Juan Pérez',
        'Progreso (%)': '100'
      },
      {
        'ID': '2',
        'Título': 'Diseño de UI/UX',
        'Descripción': 'Crear mockups y prototipos de la interfaz',
        'Fecha Inicio': '2025-01-21',
        'Fecha Fin': '2025-02-10',
        'Estado': 'En Progreso',
        'Prioridad': 'Alta',
        'Asignado': 'María García',
        'Progreso (%)': '65'
      },
      {
        'ID': '3',
        'Título': 'Desarrollo Backend',
        'Descripción': 'Implementar APIs y servicios del servidor',
        'Fecha Inicio': '2025-02-01',
        'Fecha Fin': '2025-03-15',
        'Estado': 'En Progreso',
        'Prioridad': 'Alta',
        'Asignado': 'Carlos López',
        'Progreso (%)': '40'
      },
      {
        'ID': '4',
        'Título': 'Desarrollo Frontend',
        'Descripción': 'Implementar componentes de la interfaz',
        'Fecha Inicio': '2025-02-15',
        'Fecha Fin': '2025-03-20',
        'Estado': 'Pendiente',
        'Prioridad': 'Media',
        'Asignado': 'Ana Martínez',
        'Progreso (%)': '0'
      },
      {
        'ID': '5',
        'Título': 'Pruebas de Usuario',
        'Descripción': 'Realizar testing con usuarios reales',
        'Fecha Inicio': '2025-03-21',
        'Fecha Fin': '2025-04-05',
        'Estado': 'Pendiente',
        'Prioridad': 'Media',
        'Asignado': 'Pedro Sánchez',
        'Progreso (%)': '0'
      },
      {
        'ID': '6',
        'Título': 'Lanzamiento',
        'Descripción': 'Despliegue en producción',
        'Fecha Inicio': '2025-04-06',
        'Fecha Fin': '2025-04-10',
        'Estado': 'Pendiente',
        'Prioridad': 'Alta',
        'Asignado': 'Equipo Completo',
        'Progreso (%)': '0'
      }
    ];
  }

  private parseCSV(text: string): Task[] {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('Archivo vacío o inválido');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const tasks: Task[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const task: any = {};
      headers.forEach((header, index) => {
        task[header] = values[index] || '';
      });

      tasks.push({
        id: task['ID'] || `task-${i}`,
        title: task['Título'] || task['Titulo'] || 'Sin título',
        description: task['Descripción'] || task['Descripcion'] || '',
        startDate: this.parseDate(task['Fecha Inicio']),
        endDate: this.parseDate(task['Fecha Fin']),
        status: this.parseStatus(task['Estado']),
        priority: this.parsePriority(task['Prioridad']),
        assignee: task['Asignado'] || undefined,
        progress: parseInt(task['Progreso (%)'] || '0')
      });
    }

    return tasks;
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    values.push(current.trim());
    return values;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');

    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]?.toString() || '';
        // Escapar comillas y envolver en comillas si contiene comas
        return value.includes(',') || value.includes('"')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',');
    });

    return [csvHeaders, ...csvRows].join('\n');
  }

  private downloadCSV(csv: string, filename: string): void {
    const BOM = '\uFEFF'; // UTF-8 BOM para Excel
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  private parseStatus(status: string): 'pending' | 'in-progress' | 'completed' {
    const normalized = status.toLowerCase().trim();
    if (normalized.includes('complet') || normalized.includes('finaliz')) return 'completed';
    if (normalized.includes('progres') || normalized.includes('curso')) return 'in-progress';
    return 'pending';
  }

  private parsePriority(priority: string): 'low' | 'medium' | 'high' {
    const normalized = priority.toLowerCase().trim();
    if (normalized.includes('alt') || normalized.includes('high')) return 'high';
    if (normalized.includes('medi') || normalized.includes('medium')) return 'medium';
    return 'low';
  }

  private translateStatus(status: string): string {
    const translations: Record<string, string> = {
      'pending': 'Pendiente',
      'in-progress': 'En Progreso',
      'completed': 'Completado'
    };
    return translations[status] || status;
  }

  private translatePriority(priority: string): string {
    const translations: Record<string, string> = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta'
    };
    return translations[priority] || priority;
  }

  private formatDate(date: Date): string {
    if (!(date instanceof Date)) date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
