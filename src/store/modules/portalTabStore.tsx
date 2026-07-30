import type { StateCreator } from "zustand";
import type { TabItems } from "@/types/portalStoreTypes";

import { HomeOutlined } from "@ant-design/icons";

const tabSlice: StateCreator<TabItems> = (set) => ({
  curTabInfo: null,
  activeKey: "IMAS_Index",
  tabList: [
    {
      key: "IMAS_Index",
      label: "首页",
      icon: <HomeOutlined />,
      closable: false,
      url: "index",
    },
  ],
  activeChildKey: null,
  childList: null,

  setActiveKey: (key: string) =>
    set((state) => {
      const item = state.tabList.find((t) => t.key === key);
      return { activeKey: key, curTabInfo: item || null };
    }),
  addTabList: (item) =>
    set((state) => {
      const exist = state.tabList.some((t) => t.key === item.key);
      if (exist) return { activeKey: item.key, curTabInfo: item || null }; //当前 key 已存在，切换到该标签
      return {
        tabList: [...state.tabList, item],
        activeKey: item.key,
        curTabInfo: item,
      };
    }),
  removeTabList: (key: string) => {
    set((state) => {
      const idx = state.tabList.findIndex((item) => item.key === key);
      if (idx === -1) return; // key 不存在，不做删除操作
      const newTabList = state.tabList.filter((item) => item.key !== key);

      // 删除的是当前激活的标签页时，自动切换到相邻标签
      let newActiveKey = state.activeKey;
      let newTabInfo = state.curTabInfo;
      if (state.activeKey === key) {
        const prevIdx = Math.max(0, idx - 1);
        const newActive = newTabList[Math.min(prevIdx, newTabList.length - 1)];
        newActiveKey = newActive.key;
        newTabInfo = newActive;
      }

      return {
        tabList: newTabList,
        activeKey: newActiveKey,
        curTabInfo: newTabInfo,
      };
    });
  },

  setActiveChildKey: (key: string) =>
    set(() => {
      return { activeChildKey: key };
    }),
  setChildTabs: (list, key) =>
    set({
      childList: list,
      activeChildKey: key,
    }),
});

export default tabSlice;
