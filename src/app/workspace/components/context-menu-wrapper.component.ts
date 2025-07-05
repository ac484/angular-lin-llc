import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from 'primeng/contextmenu';
import type { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-context-menu-wrapper',
  standalone: true,
  imports: [CommonModule, ContextMenuModule],
  template: `
    <div #targetContainer (contextmenu)="onRightClick($event)" style="display: inline-block; width: 100%; height: 100%;">
      <ng-content></ng-content>
    </div>

    <p-contextMenu [model]="items" [target]="targetElement"></p-contextMenu>
  `
})
export class ContextMenuWrapperComponent {
  @Input() items: MenuItem[] = [];
  @ViewChild('targetContainer', { static: true }) targetContainer!: ElementRef<HTMLElement>;

  get targetElement(): HTMLElement {
    return this.targetContainer.nativeElement;
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
} 