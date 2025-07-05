import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-shared-image',
  standalone: true,
  imports: [ImageModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedImageComponent {} 