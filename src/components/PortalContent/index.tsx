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

  // 初始化时，根据当前 url 自动添加 tab
  useEffect(() => {
    const curUrl = pathname.replace("/page/", "");
    const item = findKeyByUrl(menusItems, curUrl);
    if (item) {
      addTabList(item);
    }
  }, [menusItems]);

  useEffect(() => {
    const pageUrl = findUrlByKey(menusItems, activeKey);
    if (pageUrl) navigate(`/page/${pageUrl}`);
  }, [activeKey, navigate]);

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
