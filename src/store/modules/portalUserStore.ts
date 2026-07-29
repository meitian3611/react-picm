import type { StateCreator } from "zustand";
import { getStaffInfo, getMenus } from "@/apis/common/portalApi";
import type { UserAndMenus } from "@/types/portalStoreTypes";
import { toMenuItems } from "@/utils/menuUtils";

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
  menusItems: [],
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

    // 单独修复下异常菜单
    const arrCodes = ["Solar_Fv_Check", "Solar_Merge_Action1"];
    const mapRes = res.data.map((item: any) => {
      if (item.code === "IMAS_Solar") {
        return {
          ...item,
          children: item.children.map((child: any) => {
            if (arrCodes.includes(child.code)) {
              return {
                ...child,
                type: "MENU",
              };
            }
            return child;
          }),
        };
      }
      return item;
    });
    set({
      menus: mapRes,
      menusItems: toMenuItems(mapRes),
    });
  },
});

export default userSlice;
