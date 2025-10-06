export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  icon?: string;
  color?: string;
  completed?: boolean;
}
