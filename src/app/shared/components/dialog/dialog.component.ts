import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-shared-dialog',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDialogComponent {} 