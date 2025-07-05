import { Component } from '@angular/core';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [RatingModule],
  template: `<p-rating></p-rating>`,
  styles: [':host { display: block; }']
})
export class RatingComponent {} 