import { Tabs } from "antd";
import type { TabsProps } from "antd";
import useStore from "@/store";
import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMenuSelection from "@/hooks/useMenuSelection";

export default function PortalContent({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const tabList = useStore((state) => state.tabList);
  const activeKey = useStore((state) => state.activeKey);
  const menusItems = useStore((state) => state.menusItems);
  const curTabInfo = useStore((state) => state.curTabInfo);
  const activeChildKey = useStore((state) => state.activeChildKey);
  const childList = useStore((state) => state.childList);

  const setActiveKey = useStore((state) => state.setActiveKey);
  const removeTabList = useStore((state) => state.removeTabList);
  const addTabList = useStore((state) => state.addTabList);
  const setChildTabs = useStore((state) => state.setChildTabs);
  const setActiveChildKey = useStore((state) => state.setActiveChildKey);

  const { findKeyByUrl, findUrlByKey } = useMenuSelection(menusItems);

  const currentUrl = pathname.replace("/page/", "");
  // 标记 activeKey 变化是否由用户操作（点 tab / 关 tab）引起，
  // 用于区分“用户切换 tab 需导航”与“URL 变化同步 activeKey 不应导航”
  const isUserAction = useRef(false);

  // 路径变化 → 创建/激活匹配的 tab
  useEffect(() => {
    const item = findKeyByUrl(menusItems, currentUrl);
    if (item) {
      addTabList(item);
    }
  }, [menusItems, currentUrl, addTabList, findKeyByUrl]);

  // activeKey 变化 → 仅在用户操作（点 tab / 关 tab）时导航
  // URL 同步引起的 activeKey 变化不导航，避免刷新/路由跳转时被错误导航回首页
  useEffect(() => {
    if (!isUserAction.current) return;
    isUserAction.current = false;
    const url = findUrlByKey(menusItems, activeKey, currentUrl);
    if (url && url !== currentUrl) navigate(`/page/${url}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const onChange = (key: string) => {
    if (key !== activeKey) {
      isUserAction.current = true;
    }
    setActiveKey(key);
  };

  const onEdit: TabsProps["onEdit"] = (e, action) => {
    if (action === "remove") {
      const key = e as string;
      // 仅关闭当前激活的 tab 时才需要导航到相邻 tab
      if (key === activeKey) {
        isUserAction.current = true;
      }
      removeTabList(key);
    }
  };

  // 获取当前 tab 的子 tab
  useEffect(() => {
    const nextChildList =
      curTabInfo?.deepData?.map((item) => ({
        key: item.key,
        label: item.label,
        url: item.url,
      })) ?? [];

    const nextActiveKey =
      nextChildList.find((item) => item.url === currentUrl)?.key ??
      nextChildList[0]?.key ??
      null;

    setChildTabs(nextChildList, nextActiveKey);
  }, [curTabInfo, currentUrl, setChildTabs]);

  const onChildChange = (key: string) => {
    setActiveChildKey(key);
    const url = childList?.find((item) => item.key === key)?.url;
    if (url && url !== currentUrl) navigate(`/page/${url}`);
  };

  return (
    <div className="portal-content">
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeKey}
        items={tabList as TabsProps["items"]}
        onChange={onChange}
        onEdit={onEdit}
      />
      <div className="portal-content-body">
        {childList && childList.length > 0 && (
          <Tabs
            className="childTabs"
            items={childList as TabsProps["items"]}
            activeKey={activeChildKey ?? ""}
            onChange={onChildChange}
          />
        )}
        {children}
      </div>
    </div>
  );
}
