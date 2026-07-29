import type { StateCreator } from "zustand";
import type { TabItems } from "@/types/portalStoreTypes";
import type { TabsProps } from "antd";

import { HomeOutlined } from "@ant-design/icons";

const tabSlice: StateCreator<TabItems> = (set) => ({
  activeKey: "IMAS_Index",
  tabList: [
    {
      key: "IMAS_Index",
      label: "首页",
      icon: <HomeOutlined />,
      closable: false,
      url: "/page/index",
    },
    {
      key: "2",
      label: "Tab 2",
    },
    {
      key: "3",
      label: "Tab 3",
    },
    {
      key: "4",
      label: "Tab 4",
    },
    {
      key: "5",
      label: "Tab 5",
    },
  ],
  setActiveKey: (key: string) => set({ activeKey: key }),
  addTabList: (item: TabsProps["items"][0]) =>
    set((state) => {
      const exist = state.tabList.some((t) => t.key === item.key);
      if (exist) return { activeKey: item.key }; //当前 key 已存在，切换到该标签
      return { tabList: [...state.tabList, item], activeKey: item.key };
    }),
  removeTabList: (key: string) => {
    set((state) => {
      const idx = state.tabList.findIndex((item) => item.key === key);
      if (idx === -1) return; // key 不存在，不做删除操作
      const newTabList = state.tabList.filter((item) => item.key !== key);

      // 删除的是当前激活的标签页时，自动切换到相邻标签
      let newActiveKey = state.activeKey;
      if (state.activeKey === key) {
        const prevIdx = Math.max(0, idx - 1);
        newActiveKey = newTabList[Math.min(prevIdx, newTabList.length - 1)].key;
      }

      return { tabList: newTabList, activeKey: newActiveKey };
    });
  },
});

export default tabSlice;
