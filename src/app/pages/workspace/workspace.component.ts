import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { collection, collectionData, addDoc, Firestore } from '@angular/fire/firestore';
import { PrimeNgModules } from '../../shared/modules/prime-ng.module';
import { AsyncPipe, NgIf } from '@angular/common';
import { WorkspaceSidenavComponent } from '../../layouts/main-layout/workspace-sidenav/workspace-sidenav.component';
import { Observable } from 'rxjs';

interface WorkspaceNode {
  id?: string;
  label: string;
}

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
  private firestore = inject(Firestore);
  treeNodes$: Observable<WorkspaceNode[]> = collectionData(collection(this.firestore, 'workspaceTree'), { idField: 'id' }) as Observable<WorkspaceNode[]>;

  async addNode() {
    const node: WorkspaceNode = { label: '新節點' };
    await addDoc(collection(this.firestore, 'workspaceTree'), node);
  }
}
