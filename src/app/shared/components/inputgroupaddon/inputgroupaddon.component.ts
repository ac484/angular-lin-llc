import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-shared-inputgroupaddon',
  standalone: true,
  imports: [InputGroupModule],
  templateUrl: './inputgroupaddon.component.html',
  styleUrls: ['./inputgroupaddon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputgroupaddonComponent {} 