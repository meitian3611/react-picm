import { Tabs } from "antd";
import useStore from "@/store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMenuSelection from "@/hooks/useMenuSelection";

export default function PortalContent({ children }) {
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
  // 路径变化 → 创建/激活匹配的 tab
  useEffect(() => {
    const item = findKeyByUrl(menusItems, currentUrl);
    if (item) {
      addTabList(item);
    }
  }, [menusItems, currentUrl, addTabList, findKeyByUrl]);

  // activeKey 变化 → 导航到对应页面
  useEffect(() => {
    const url = findUrlByKey(menusItems, activeKey, currentUrl);
    if (url) navigate(`/page/${url}`);
  }, [activeKey, menusItems, navigate, currentUrl, findUrlByKey]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onEdit = (key: string, action: string) => {
    if (action === "remove") {
      removeTabList(key);
    }
  };

  // 获取当前 tab 的子 tab
  useEffect(() => {
    const childList =
      curTabInfo?.deepData?.map((item: any) => ({
        key: item.key,
        label: item.label,
        url: item.url,
      })) ?? [];

    const activeKey =
      childList.find((item) => item.url === currentUrl)?.key ??
      childList[0]?.key ??
      null;

    setChildTabs(childList, activeKey);
  }, [curTabInfo, currentUrl, setChildTabs]);

  const onChildChange = (key: string) => {
    setActiveChildKey(key);
    const url = (childList?.find((item) => item.key === key) as any)?.url;
    if (url) navigate(`/page/${url}`);
  };

  return (
    <div className="portal-content">
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeKey}
        items={tabList}
        onChange={onChange}
        onEdit={onEdit}
      />
      <div className="portal-content-body">
        {childList?.length > 0 && (
          <Tabs
            className="childTabs"
            items={childList}
            activeKey={activeChildKey}
            onChange={onChildChange}
          />
        )}
        {children}
      </div>
    </div>
  );
}
