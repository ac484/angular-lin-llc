import { Component } from '@angular/core';
import { Slider } from 'primeng/slider';

@Component({
  selector: 'app-shared-slider',
  standalone: true,
  imports: [Slider],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SharedSliderComponent {} 