import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-shared-iconfield',
  standalone: true,
  imports: [IconFieldModule],
  templateUrl: './iconfield.component.html',
  styleUrls: ['./iconfield.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedIconfieldComponent {} 