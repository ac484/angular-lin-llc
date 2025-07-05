import { Component } from '@angular/core';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [PopoverModule],
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent {} 