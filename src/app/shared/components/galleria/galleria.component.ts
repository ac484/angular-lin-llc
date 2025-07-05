import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-shared-galleria',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './galleria.component.html',
  styleUrls: ['./galleria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedGalleriaComponent {} 