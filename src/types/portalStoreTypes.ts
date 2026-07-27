export type User = {
  roles: any[];
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
};

export type Menu = {
  children: Menu[];
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
};

export interface UserAndMenus {
  userInfo: User;
  menus: Menu[];
  fetchUserInfo: () => Promise<void>;
  fetchMenus: () => Promise<void>;
}
