import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';

@Component({
  selector: 'app-splitter',
  standalone: true,
  imports: [SplitterModule],
  templateUrl: './splitter.component.html',
  styleUrls: ['./splitter.component.scss']
})
export class SplitterComponent {} 