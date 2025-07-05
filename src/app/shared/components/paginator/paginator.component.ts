import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [Paginator],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent {} 