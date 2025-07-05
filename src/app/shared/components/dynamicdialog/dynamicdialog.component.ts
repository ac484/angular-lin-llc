import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-shared-dynamicdialog',
  standalone: true,
  imports: [DynamicDialogModule],
  templateUrl: './dynamicdialog.component.html',
  styleUrls: ['./dynamicdialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDynamicdialogComponent {} 