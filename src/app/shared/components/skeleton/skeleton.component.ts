import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-shared-skeleton',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SharedSkeletonComponent {} 