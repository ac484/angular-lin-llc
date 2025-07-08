import { TreeLiveModule } from './tree-live/tree-live.module'; // 匯入 NgModule
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NODES } from './tree-live/tree-mock';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TreeLiveModule]
})
export class WorkspaceComponent {
  tree = NODES;
}
