import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UseStyle } from 'primeng/usestyle';

@Component({
  selector: 'app-shared-usestyle',
  standalone: true,
  imports: [],
  templateUrl: './usestyle.component.html',
  styleUrls: ['./usestyle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedUseStyleComponent implements OnInit {
  @Input() css!: string;
  @Input() options?: any;

  constructor(private useStyle: UseStyle) {}

  ngOnInit(): void {
    this.useStyle.use(this.css, this.options);
  }
} 