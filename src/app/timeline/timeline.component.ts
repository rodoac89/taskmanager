import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from './timeline.interface';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent {
  events = input.required<TimelineEvent[]>();
  orientation = input<'vertical' | 'horizontal'>('vertical');
}
