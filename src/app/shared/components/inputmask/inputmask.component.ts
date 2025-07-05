import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-inputmask',
  standalone: true,
  imports: [InputMaskModule, FormsModule],
  templateUrl: './inputmask.component.html',
  styleUrls: ['./inputmask.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputmaskComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() mask?: string;
} 