import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-editor',
  standalone: true,
  imports: [EditorModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedEditorComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
} 