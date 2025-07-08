import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TreeService } from '../../services/tree.service';
import { PrimeNgModules } from '../../shared/modules/prime-ng.module';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ...PrimeNgModules,
    AsyncPipe,
    NgIf
  ]
})
export class WorkspaceComponent {
  treeNodes$;
  constructor(private treeService: TreeService) {
    this.treeNodes$ = this.treeService.getTreeNodes();
  }
}
