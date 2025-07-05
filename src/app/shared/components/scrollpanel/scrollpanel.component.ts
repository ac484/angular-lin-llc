import { Component } from '@angular/core';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-scrollpanel',
  standalone: true,
  imports: [ScrollPanelModule],
  template: `<p-scrollPanel><ng-content></ng-content></p-scrollPanel>`,
  styles: [':host { display: block; }']
})
export class ScrollpanelComponent {} 