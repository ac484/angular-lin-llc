import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-shared-avatar-group',
  standalone: true,
  imports: [AvatarGroupModule],
  templateUrl: './avatargroup.component.html',
  styleUrls: ['./avatargroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAvatarGroupComponent {
  @Input() styleClass: string | undefined;
  @Input() style: { [key: string]: any } | null | undefined;
} 