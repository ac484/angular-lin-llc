import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-shared-avatar',
  standalone: true,
  imports: [AvatarModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedAvatarComponent {
  @Input() label: string | undefined;
  @Input() icon: string | undefined;
  @Input() image: string | undefined;
  @Input() size: 'normal' | 'large' | 'xlarge' | undefined = 'normal';
  @Input() shape: 'square' | 'circle' | undefined = 'square';
} 