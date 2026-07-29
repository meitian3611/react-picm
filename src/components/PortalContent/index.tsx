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
    curTabInfo,
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
    if (!curTabInfo) return;
    // 递归取节点本身或第一个子级的 url（兼容 MENU 容器场景）
    const findUrl = (node: any): string | undefined => {
      if (node.url) return node.url;
      const sub = node.deepData;
      return sub?.length ? findUrl(sub[0]) : undefined;
    };
    const url = findUrl(curTabInfo);
    if (url) navigate(`/page/${url}`);
  }, [curTabInfo, navigate]);

  const onChange = (key: string) => {
    setActiveKey(key);
    const pageUrl = findUrlByKey(menusItems, key);
    if (pageUrl) {
      navigate(`/page/${pageUrl}`);
    }
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
