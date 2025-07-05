import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-shared-datepicker',
  standalone: true,
  imports: [DatePickerModule],
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDatepickerComponent {} 