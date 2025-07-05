import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InplaceModule } from 'primeng/inplace';

@Component({
  selector: 'app-shared-inplace',
  standalone: true,
  imports: [InplaceModule],
  templateUrl: './inplace.component.html',
  styleUrls: ['./inplace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInplaceComponent {} 