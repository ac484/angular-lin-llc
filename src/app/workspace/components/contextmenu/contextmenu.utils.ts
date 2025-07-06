import { MenuItem } from 'primeng/api';
import { WorkspaceNode } from '../../../core/models/workspace.types';

export function getContextMenuItems(
  node: WorkspaceNode,
  addChild: () => void,
  addTask: () => void
): MenuItem[] {
  const items: MenuItem[] = [];
  items.push({
    label: '新增子節點',
    icon: 'pi pi-plus',
    command: addChild
  });
  items.push({
    label: '新增任務',
    icon: 'pi pi-tasks',
    command: addTask
  });
  // 可依 node.type/status 增減功能
  return items;
}
