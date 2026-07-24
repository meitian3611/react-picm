import type { StateCreator } from "zustand";

// 模块1的类型定义
export interface User {
  userInfo: any;
}

// 修改当前用户信息
const changeUserInfo = (curUser: User) => {
  return {
    ...curUser,
  };
};
// StateCreator<当前模块State> —— 最简写法，后三个参数有默认值无需显式指定
// 如需跨模块访问，可传第二个泛型: StateCreator<Test1Slice, [], [], Store>
const userSlice: StateCreator<User> = (set) => ({
  userInfo: {
    id: 1,
    name: "v_tianmei",
    chineseName: "mmt",
    bgName: "前端开发组",
  },
  setUserInfo: (curUser: User) => set({ userInfo: changeUserInfo(curUser) }),
});

export default userSlice;
