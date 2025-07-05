import { Component } from '@angular/core';
import { PickListModule } from 'primeng/picklist';

@Component({
  selector: 'app-picklist',
  standalone: true,
  imports: [PickListModule],
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.scss']
})
export class PicklistComponent {} 