import { Component, Input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-progressbar',
  standalone: true,
  imports: [ProgressBarModule],
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent {
  @Input() value: number | null = null;
} 