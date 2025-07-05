import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-shared-inputgroupaddon',
  standalone: true,
  imports: [InputGroupAddonModule],
  templateUrl: './inputgroupaddon.component.html',
  styleUrls: ['./inputgroupaddon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInputgroupaddonComponent {} 