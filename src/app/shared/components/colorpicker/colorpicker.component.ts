import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ColorPickerModule, } from 'primeng/colorpicker';
// import { ColorPickerChangeEvent } from 'primeng/api';

@Component({
  selector: 'app-shared-colorpicker',
  standalone: true,
  imports: [ColorPickerModule],
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedColorPickerComponent {
  @Input() inline?: boolean;
  @Input() format: 'hex' | 'rgb' | 'hsb' = 'hex';
  @Output() onChange = new EventEmitter<any>();
} 