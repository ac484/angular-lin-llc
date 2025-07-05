import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-shared-select',
  standalone: true,
  imports: [SelectModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SharedSelectComponent {} 