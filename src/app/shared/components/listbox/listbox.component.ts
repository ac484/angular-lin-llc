import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-listbox',
  standalone: true,
  imports: [ListboxModule, FormsModule],
  templateUrl: './listbox.component.html',
  styleUrls: ['./listbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedListboxComponent {
  @Input() options: any[] = [];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
} 