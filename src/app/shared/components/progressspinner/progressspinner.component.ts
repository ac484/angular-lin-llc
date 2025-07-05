import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-progressspinner',
  standalone: true,
  imports: [ProgressSpinnerModule],
  template: `<p-progressSpinner></p-progressSpinner>`,
  styles: [':host { display: block; }']
})
export class ProgressspinnerComponent {} 