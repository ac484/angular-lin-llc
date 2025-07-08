import { Component } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PrimeNgModules } from '../../../shared/modules/prime-ng.module';
import { TreeService, TreeNode } from '../../../services/tree.service';
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
  treeNodes$: Observable<TreeNode[]>;
  constructor(private treeService: TreeService) {
    this.treeNodes$ = this.treeService.getTreeNodes();
  }
}
