import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-shared-drawer',
  standalone: true,
  imports: [DrawerModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDrawerComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onShow = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<any>();
} 