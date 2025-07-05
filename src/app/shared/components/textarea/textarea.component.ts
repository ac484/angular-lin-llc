import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-textarea',
  standalone: true,
  imports: [TextareaModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTextareaComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
} 