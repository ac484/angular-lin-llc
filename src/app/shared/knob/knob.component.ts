import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-knob',
  standalone: true,
  imports: [KnobModule, FormsModule],
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedKnobComponent {
  @Input() value: number = 0;
  @Output() valueChange = new EventEmitter<number>();
} 