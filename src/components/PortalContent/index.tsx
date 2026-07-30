import { Tabs } from "antd";
import useStore from "@/store";
import { useEffect, useMemo } from "react";
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

  // 获取当前 tab 的子 tab（deepData 可能是 false 或数组）
  const childTabs = useMemo(() => {
    if (!curTabInfo?.deepData?.length) return null;
    return curTabInfo.deepData.map((item) => ({
      key: item.key,
      label: item.label,
      url: item.url,
    }));
  }, [curTabInfo]);

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
      <div className="portal-content-body">
        {childTabs && <Tabs className="childTabs" items={childTabs} />}
        {children}
      </div>
    </div>
  );
}
