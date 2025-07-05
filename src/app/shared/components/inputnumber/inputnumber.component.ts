import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-inputnumber',
  standalone: true,
  imports: [InputNumberModule, FormsModule],
  templateUrl: './inputnumber.component.html',
  styleUrls: ['./inputnumber.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputnumberComponent {
  @Input() value: number | null = null;
  @Output() valueChange = new EventEmitter<number | null>();
} 