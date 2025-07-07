// src/app/core/models/workspace.types.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
// 廠案管理核心型別定義 - 支援動態擴展的無限節點結構

/**
 * 通用節點型別 - 支援無限層級和動態擴展
 */
export interface WorkspaceNode {
    id: string // 節點ID
    name: string // 節點名稱
    type: string // 節點型別，必須對應 NodeType.id（如 'root', 'branch', 'leaf' 或自訂型別）
    parentId?: string | null // 父節點ID
    children?: WorkspaceNode[] // 子節點陣列
    
    // 節點基本資訊
    code?: string // 節點代碼，如 F001, A001, DEP001 等
    description?: string // 節點描述
    status: 'active' | 'inactive' | 'completed' | 'archived' // 節點狀態
    
    // 動態屬性 - 支援不同類型的節點有不同的屬性
    properties?: Record<string, unknown>
    
    // 時間管理
    createdAt: Date // 創建時間
    updatedAt: Date // 更新時間
    
    // 權限控制
    permissions?: string[] // 權限控制
    
    // 排序和顯示
    order?: number // 排序
    isVisible?: boolean // 是否可見

    // 節點下任務清單
    tasks?: Task[]
}
  
/**
 * 節點類型定義 - 可動態擴展
 */
export interface NodeType {
    id: string // 節點型別ID，必須與 WorkspaceNode.type 對應
    name: string // 顯示名稱
    allowedChildren?: string[] // 允許的子節點型別（NodeType.id 陣列）
    properties?: string[] // 該型別節點擁有的屬性
    isLeaf?: boolean // 是否為葉節點（不可有子節點）
}

export const NODE_TYPES: NodeType[] = [
  { id: 'root', name: '根結點', allowedChildren: ['branch'] },
  { id: 'branch', name: '資料夾', allowedChildren: ['branch', 'leaf'] },
  { id: 'leaf', name: '檔案', isLeaf: true }
];
  
/**
 * 任務型別 - 可關聯到任何節點
 */
export interface Task {
    id: string // 任務ID
    nodeId: string // 關聯的節點 ID
    title: string // 任務標題
    description?: string // 任務描述
    
    // 任務狀態
    status: 'pending' | 'in-progress' | 'completed' | 'reviewed' | 'approved' | 'cancelled'
    progress: number // 完成度百分比 0-100
    
    // 人員指派
    assigneeId: string // 執行人員
    reviewerId: string // 審核人員
    
    // 時間管理
    plannedStartDate?: Date // 計劃開始日期
    plannedEndDate?: Date // 計劃結束日期
    actualStartDate?: Date // 實際開始日期
    actualEndDate?: Date // 實際結束日期
    
    // 動態屬性
    customFields?: Record<string, unknown>
    
    // 基本時間戳記
    createdAt: Date // 創建時間
    updatedAt: Date // 更新時間

    // 新增：歷史紀錄
    historyLogs?: Array<{
      action: string // 動作
      timestamp: Date // 時間戳記
      userId: string // 用戶ID
      details?: string // 詳細資訊
    }>

    dependencies?: string[] // 儲存「必須先完成的任務ID」陣列
}
  
/**
 * 用戶型別 - 支援動態角色
 */

export interface User {
    id: string; // Firebase UID 唯一識別碼
    email: string; // 電子郵件
    displayName?: string; // 顯示名稱
    role?: string; // 例如 'admin' | 'user'
    createdAt: Date; // 創建時間
}
  
export interface WorkspaceUser extends User {
    role: string // 動態角色，如 'admin', 'manager', 'worker', 'inspector', 'supervisor' 等
    department?: string // 部門
    skills?: string[] // 技能
    isActive: boolean // 是否活躍
    
    // 動態屬性
    customFields?: Record<string, unknown> // 自定義屬性
}


//PrimeNG Tree需要的型別 要實現原生拖曳功能 所以需要以下型別

// export interface TreeNode<T = any> { // 樹狀結構節點型別
//    label?: string; // 節點標籤
//    data?: T; // 節點資料
//    icon?: string; // 節點圖示
//    expandedIcon?: string; // 展開圖示
//    collapsedIcon?: string; // 收合圖示
//    children?: TreeNode<T>[]; // 子節點
//    leaf?: boolean; // 是否為葉節點
//    expanded?: boolean; // 是否展開
//    type?: string; // 節點類型
//    parent?: TreeNode<T>; // 父節點
//    partialSelected?: boolean; // 部分選中
//    style?: any; // 節點樣式
//    styleClass?: string; // 節點樣式類別
//    draggable?: boolean; // 是否可拖動
//    droppable?: boolean; // 是否可放置
//    selectable?: boolean; // 是否可選中
//    key?: string; // 節點鍵值
//    loading?: boolean; // 是否加載中
// }