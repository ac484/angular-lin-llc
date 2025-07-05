import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-shared-iftalabel',
  standalone: true,
  imports: [IftaLabelModule],
  templateUrl: './iftalabel.component.html',
  styleUrls: ['./iftalabel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedIftalabelComponent {} 