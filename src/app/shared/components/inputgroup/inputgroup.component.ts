import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-shared-inputgroup',
  standalone: true,
  imports: [InputGroupModule],
  templateUrl: './inputgroup.component.html',
  styleUrls: ['./inputgroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputgroupComponent {} 