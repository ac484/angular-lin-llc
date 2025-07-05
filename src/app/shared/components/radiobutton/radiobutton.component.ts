import { Component } from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-radiobutton',
  standalone: true,
  imports: [RadioButtonModule],
  template: `<p-radiobutton></p-radiobutton>`,
  styles: [':host { display: block; }']
})
export class RadiobuttonComponent {} 