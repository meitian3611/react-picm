import { create } from "zustand";
import userSlice from "./modules/portalStore";
import type { UserAndMenus } from "@/types/portalStoreTypes";

// 合并所有模块的 State 类型（当有多个模块时，用 & 连接）
// 例如: Test1Slice & Test2Slice & Test3Slice
export type Store = UserAndMenus;

// 创建 store —— 将 set/get/api 传递给每个模块的 createSlice
const useStore = create<Store>()((...args) => ({
  ...userSlice(...args),
}));

export default useStore;
