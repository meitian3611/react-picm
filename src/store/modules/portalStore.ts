import type { StateCreator } from "zustand";
import { getStaffInfo, getMenus } from "@/apis/common/portalApi";
import type { UserAndMenus } from "@/types/portalStoreTypes";

// StateCreator<当前模块State> —— 最简写法，后三个参数有默认值无需显式指定
// 如需跨模块访问，可传第二个泛型: StateCreator<Test1Slice, [], [], Store>
const userSlice: StateCreator<UserAndMenus> = (set) => ({
  userInfo: {
    roles: [],
    user: {
      bgName: "",
      bgId: 0,
      chineseName: "",
      deptId: 0,
      deptName: "",
      email: "",
      fullName: "",
      id: 0,
      name: "",
      orgId: 0,
      orgName: "",
    },
  },
  menus: [],
  // 异步获取用户信息
  fetchUserInfo: async () => {
    const res = await getStaffInfo();
    set({
      userInfo: res.data,
    });
  },
  // 异步获取菜单信息
  fetchMenus: async () => {
    const res = await getMenus();
    set({
      menus: res.data,
    });
  },
});

export default userSlice;
