import { Tabs } from "antd";
import useStore from "@/store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useMenuSelection from "@/hooks/useMenuSelection";

export default function PortalContent({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    tabList,
    activeKey,
    setActiveKey,
    removeTabList,
    menusItems,
    addTabList,
  } = useStore();
  const { findKeyByUrl, findUrlByKey } = useMenuSelection(menusItems);

  // 路径变化 → 创建/激活匹配的 tab
  useEffect(() => {
    const curUrl = pathname.replace("/page/", "");
    const item = findKeyByUrl(menusItems, curUrl);
    if (item) addTabList(item);
  }, [menusItems, pathname, addTabList, findKeyByUrl]);

  // activeKey 变化 → 导航到对应页面
  useEffect(() => {
    const url = findUrlByKey(menusItems, activeKey);
    if (url) navigate(`/page/${url}`);
  }, [activeKey, menusItems, navigate, findUrlByKey]);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const onEdit = (key: string, action: string) => {
    if (action === "remove") {
      removeTabList(key);
    }
  };
  return (
    <div className="portal-content">
      <Tabs
        hideAdd
        type="editable-card"
        defaultActiveKey="IMAS_Index"
        activeKey={activeKey}
        items={tabList}
        onChange={onChange}
        onEdit={onEdit}
      />
      {children}
    </div>
  );
}
