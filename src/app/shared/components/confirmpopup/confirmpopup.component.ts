import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-shared-confirmpopup',
  standalone: true,
  imports: [ConfirmPopupModule],
  templateUrl: './confirmpopup.component.html',
  styleUrls: ['./confirmpopup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedConfirmpopupComponent {} 