import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-multiselect',
  standalone: true,
  imports: [MultiSelectModule, FormsModule],
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedMultiselectComponent {
  @Input() options: any[] = [];
  @Input() value: any[] = [];
  @Output() valueChange = new EventEmitter<any[]>();
} 