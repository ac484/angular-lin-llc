import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
// import { CarouselResponsiveOptions, CarouselPageEvent } from 'primeng/api';

@Component({
  selector: 'app-shared-carousel',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedCarouselComponent {
  @Input() value: any[] = [];
  @Input() responsiveOptions: any[] = [];
  @Input() circular = false;
  @Input() autoplayInterval = 0;
  @Input() numVisible = 1;
  @Input() numScroll = 1;
  @Input() styleClass?: string;
  @Output() onPage = new EventEmitter<any>();
} 