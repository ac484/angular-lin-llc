import { Component } from '@angular/core';
import { SpeedDial } from 'primeng/speeddial';

@Component({
  selector: 'app-shared-speeddial',
  standalone: true,
  imports: [SpeedDial],
  templateUrl: './speeddial.component.html',
  styleUrls: ['./speeddial.component.scss']
})
export class SharedSpeeddialComponent {} 