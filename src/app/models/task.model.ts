export interface Task {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  progress?: number;

  // Campos adicionales del CSV de Fraude
  simbology?: string; // Green, Yellow, Red
  estado?: string; // Completado, En progreso, No iniciada
  requerimiento?: string;
  entregable?: string;
  baselineStart?: Date;
  baselineFinish?: Date;
  duracionPlaneada?: string;
  avancePlanificado?: string;
  variance?: number;
  duration?: string;
  predecessors?: string;
  solutionArchitect?: string;
}
