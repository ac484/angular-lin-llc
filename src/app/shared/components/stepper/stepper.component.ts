import { Component } from '@angular/core';
import { Stepper } from 'primeng/stepper';

@Component({
  selector: 'app-shared-stepper',
  standalone: true,
  imports: [Stepper],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class SharedStepperComponent {} 