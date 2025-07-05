import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-shared-accordion',
  standalone: true,
  imports: [AccordionModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAccordionComponent {} 