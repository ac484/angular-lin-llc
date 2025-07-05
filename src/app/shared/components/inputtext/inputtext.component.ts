import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-inputtext',
  standalone: true,
  imports: [InputTextModule, FormsModule],
  templateUrl: './inputtext.component.html',
  styleUrls: ['./inputtext.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputtextComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() placeholder?: string;
  @Input() disabled?: boolean;
} 