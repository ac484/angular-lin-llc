import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ImageCompareModule } from 'primeng/imagecompare';

@Component({
  selector: 'app-shared-imagecompare',
  standalone: true,
  imports: [ImageCompareModule],
  templateUrl: './imagecompare.component.html',
  styleUrls: ['./imagecompare.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedImagecompareComponent {} 