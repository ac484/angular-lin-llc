import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-shared-confirmdialog',
  standalone: true,
  imports: [ConfirmDialogModule],
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedConfirmdialogComponent {} 