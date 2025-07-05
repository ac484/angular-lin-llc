import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OrderList } from 'primeng/orderlist';

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [OrderList],
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderlistComponent {} 