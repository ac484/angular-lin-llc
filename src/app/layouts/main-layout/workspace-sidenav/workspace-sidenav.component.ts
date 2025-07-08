import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { TreeService, WorkspaceNode } from '../../../services/tree.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-sidenav',
  templateUrl: './workspace-sidenav.component.html',
  styleUrls: ['./workspace-sidenav.component.scss'],
  standalone: true,
  imports: [CommonModule, SidenavComponent, ...PrimeNgModules]
})
export class WorkspaceSidenavComponent {
  treeNodes$: Observable<WorkspaceNode[]>;
  constructor(private treeService: TreeService) {
    this.treeNodes$ = this.treeService.getWorkspaceNodes();
  }

  onAddNode() {
    const node: WorkspaceNode = { label: '新節點' };
    this.treeService.addWorkspaceNode(node);
  }

  onManageNode() {
    alert('管理節點');
  }
}
