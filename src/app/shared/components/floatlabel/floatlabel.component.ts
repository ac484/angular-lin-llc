import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-shared-floatlabel',
  standalone: true,
  imports: [FloatLabelModule],
  templateUrl: './floatlabel.component.html',
  styleUrls: ['./floatlabel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFloatlabelComponent {} 