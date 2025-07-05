import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-inputotp',
  standalone: true,
  imports: [InputOtpModule, FormsModule],
  templateUrl: './inputotp.component.html',
  styleUrls: ['./inputotp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputotpComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Input() length: number = 4;
} 