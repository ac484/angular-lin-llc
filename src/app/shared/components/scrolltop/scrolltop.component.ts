import { Component } from '@angular/core';
import { ScrollTopModule } from 'primeng/scrolltop';

@Component({
  selector: 'app-shared-scrolltop',
  standalone: true,
  imports: [ScrollTopModule],
  templateUrl: './scrolltop.component.html',
  styleUrls: ['./scrolltop.component.scss']
})
export class SharedScrolltopComponent {} 