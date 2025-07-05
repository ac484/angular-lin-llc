import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-shared-inputicon',
  standalone: true,
  imports: [InputIconModule],
  templateUrl: './inputicon.component.html',
  styleUrls: ['./inputicon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputiconComponent {} 