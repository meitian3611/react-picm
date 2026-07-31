import type { ReactNode } from "react";

// 后端返回的原始菜单数据
export interface Menu {
  children?: Menu[];
  code: string;
  id: number;
  appId: number;
  name: string;
  url: string;
  type: string;
  order: number;
  target: string;
  permission: string;
  icon: string;
}

export interface User {
  roles: unknown[];
  user: {
    bgName: string;
    bgId: number;
    chineseName: string;
    deptId: number;
    deptName: string;
    email: string;
    fullName: string;
    id: number;
    name: string;
    orgId: number;
    orgName: string;
  };
}

// toMenuItems 转换后的菜单 / Tab 项结构（antd Menu items + 业务字段）
export interface MenuItemConverted {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  url?: string;
  type?: string;
  children?: MenuItemConverted[];
  deepData?: MenuItemConverted[];
  closable?: boolean;
}

export interface UserAndMenus {
  userInfo: User;
  menus: Menu[];
  menusItems: MenuItemConverted[];
  fetchUserInfo: () => Promise<void>;
  fetchMenus: () => Promise<void>;
}

export interface TabItems {
  curTabInfo: MenuItemConverted | null;
  activeKey: string;
  tabList: MenuItemConverted[];
  activeChildKey: string | null;
  childList: MenuItemConverted[] | null;
  setActiveKey: (key: string) => void;
  addTabList: (tab: MenuItemConverted) => void;
  removeTabList: (key: string) => void;
  setChildTabs: (list: MenuItemConverted[] | null, key: string | null) => void;
  setActiveChildKey: (key: string) => void;
}
