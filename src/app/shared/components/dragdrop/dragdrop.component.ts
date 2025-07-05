import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Draggable, Droppable } from 'primeng/dragdrop';

@Component({
  selector: 'app-shared-dragdrop',
  standalone: true,
  imports: [Draggable, Droppable],
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedDragdropComponent {} 