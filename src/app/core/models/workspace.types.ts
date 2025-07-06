// src/app/core/models/workspace.types.ts
// 本檔案依據 Firebase Console 專案設定，使用 Firebase Client SDK 操作 Cloud Firestore
// 廠案管理核心型別定義 - 支援動態擴展的無限節點結構

/**
 * 通用節點型別 - 支援無限層級和動態擴展
 */
export interface WorkspaceNode {
    id: string
    name: string
    type: string // 動態類型，如 'factory', 'area', 'building', 'floor', 'level', 'station', 'task', 'department', 'team' 等
    nodeTypeId: string // 新增：對應 NodeType.id，決定節點的型態、圖示、顏色等
    parentId?: string | null
    children?: WorkspaceNode[]
    
    // 節點基本資訊
    code?: string // 節點代碼，如 F001, A001, DEP001 等
    description?: string
    status: 'active' | 'inactive' | 'completed' | 'archived'
    
    // 動態屬性 - 支援不同類型的節點有不同的屬性
    properties?: Record<string, unknown>
    
    // 時間管理
    createdAt: Date
    updatedAt: Date
    
    // 權限控制
    permissions?: string[]
    
    // 排序和顯示
    order?: number
    isVisible?: boolean
  }
  
  /**
   * 節點類型定義 - 可動態擴展
   */
  export interface NodeType {
    id: string
    name: string
    icon: string
    color: string
    allowedChildren?: string[] // 允許的子節點類型
    properties?: string[] // 該類型節點擁有的屬性
    isLeaf?: boolean // 是否為葉節點（不可有子節點）
  }
  
  /**
   * 任務型別 - 可關聯到任何節點
   */
  export interface Task {
    id: string
    nodeId: string // 關聯的節點 ID
    title: string
    description?: string
    
    // 任務狀態
    status: 'pending' | 'in-progress' | 'completed' | 'reviewed' | 'approved' | 'cancelled'
    progress: number // 完成度百分比 0-100
    
    // 人員指派
    assigneeId: string // 執行人員
    reviewerId: string // 審核人員
    
    // 時間管理
    plannedStartDate?: Date
    plannedEndDate?: Date
    actualStartDate?: Date
    actualEndDate?: Date
    
    // 動態屬性
    customFields?: Record<string, unknown>
    
    // 基本時間戳記
    createdAt: Date
    updatedAt: Date

    // 新增：歷史紀錄
    historyLogs?: Array<{
      action: string
      timestamp: Date
      userId: string
      details?: string
    }>

    dependencies?: string[] // 儲存「必須先完成的任務ID」陣列
  }
  
  /**
   * 用戶型別 - 支援動態角色
   */

  export interface User {
    id: string; // Firebase UID
    email: string;
    displayName?: string;
    role?: string; // 例如 'admin' | 'user'
    createdAt: Date;
  }
  
  export interface WorkspaceUser extends User {
    role: string // 動態角色，如 'admin', 'manager', 'worker', 'inspector', 'supervisor' 等
    department?: string
    skills?: string[]
    isActive: boolean
    
    // 動態屬性
    customFields?: Record<string, unknown>
  }


//PrimeNG Tree需要的型別

  export interface TreeNode<T = any> { // 樹狀結構節點型別
    label?: string; // 節點標籤
    data?: T; // 節點資料
    icon?: string; // 節點圖示
    expandedIcon?: string; // 展開圖示
    collapsedIcon?: string; // 收合圖示
    children?: TreeNode<T>[]; // 子節點
    leaf?: boolean; // 是否為葉節點
    expanded?: boolean; // 是否展開
    type?: string; // 節點類型
    parent?: TreeNode<T>; // 父節點
    partialSelected?: boolean; // 部分選中
    style?: any; // 節點樣式
    styleClass?: string; // 節點樣式類別
    draggable?: boolean; // 是否可拖動
    droppable?: boolean; // 是否可放置
    selectable?: boolean; // 是否可選中
    key?: string; // 節點鍵值
    loading?: boolean; // 是否加載中
  }