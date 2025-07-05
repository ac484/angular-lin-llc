import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-shared-buttongroup',
  standalone: true,
  imports: [ButtonGroupModule],
  templateUrl: './buttongroup.component.html',
  styleUrls: ['./buttongroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedButtongroupComponent {} 