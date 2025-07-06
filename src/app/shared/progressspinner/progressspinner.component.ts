import { Component, Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-progressspinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `<p-progressSpinner [style]="style" [styleClass]="styleClass"></p-progressSpinner>`,
  styles: [':host { display: block; }']
})
export class ProgressspinnerComponent {
  @Input() style: { [klass: string]: any } | null = null;
  @Input() styleClass: string | undefined;
} 