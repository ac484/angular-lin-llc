import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-ripple',
  standalone: true,
  imports: [RippleModule],
  template: `<div pRipple><ng-content></ng-content></div>`,
  styles: [':host { display: block; }']
})
export class RippleComponent {} 