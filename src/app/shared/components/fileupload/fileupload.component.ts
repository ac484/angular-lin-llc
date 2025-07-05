import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-shared-fileupload',
  standalone: true,
  imports: [FileUploadModule],
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedFileuploadComponent {} 