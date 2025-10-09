import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TimelineViewComponent } from './pages/timeline-view/timeline-view.component';
import { KanbanViewComponent } from './pages/kanban-view/kanban-view.component';
import { GanttViewComponent } from './pages/gantt-view/gantt-view.component';
import { BurndownViewComponent } from './pages/burndown-view/burndown-view.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'timeline', component: TimelineViewComponent },
  { path: 'kanban', component: KanbanViewComponent },
  { path: 'gantt', component: GanttViewComponent },
  { path: 'burndown', component: BurndownViewComponent },
  { path: '**', redirectTo: '' }
];
