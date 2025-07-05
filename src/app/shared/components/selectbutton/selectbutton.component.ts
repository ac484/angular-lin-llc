import { Component } from '@angular/core';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-shared-selectbutton',
  standalone: true,
  imports: [SplitButtonModule],
  templateUrl: './selectbutton.component.html',
  styleUrls: ['./selectbutton.component.scss']
})
export class SharedSelectbuttonComponent {} 