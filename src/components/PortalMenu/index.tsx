import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";

import { SolutionOutlined } from "@ant-design/icons";

import p1Logo from "@/assets/images/p1_logo.png";
import p2Logo from "@/assets/images/p2_logo.png";
import useStore from "@/store";
import { useMemo } from "react";
import useMenuOpenKeys from "@/hooks/useMenuOpenKeys";
import useMenuSelection from "@/hooks/useMenuSelection";

const { Sider } = Layout;

const toMenuItems = (items: any[], depth = 0): any[] =>
  items.map((item) => ({
    key: item.code,
    icon: depth == 0 && <SolutionOutlined />,
    label: item.name,
    url: item.url,
    type: item.type,
    children:
      item.type === "ACTION" &&
      item.children?.length &&
      toMenuItems(item.children, depth + 1),
  }));

export default function PortalMenu({ collapsed }) {
  const navigate = useNavigate();
  const { menus } = useStore();
  const menusMemo = useMemo(() => toMenuItems(menus), [menus]); // 递归转换菜单数据

  const { selectedKeys, parentKeys, findUrlByKey } =
    useMenuSelection(menusMemo);
  const { stateOpenKeys, onOpenChange } = useMenuOpenKeys(
    menusMemo,
    parentKeys,
  );

  const menuClick = (info: { key: string }) => {
    const url = findUrlByKey(menusMemo, info.key);
    if (url) {
      navigate(`/page/${url}`);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={collapsed ? 70 : 220}
      style={{ overflow: "auto" }}
    >
      <div className="icm-logo-vertical">
        <div className="lg-logo" style={{ display: collapsed && "none" }}>
          <img src={p1Logo} width={100} height={33} />
          <span className="text">imas.woa.com</span>
        </div>
        <img
          src={p2Logo}
          width={54}
          height={18}
          style={{ display: !collapsed && "none" }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={menuClick}
        items={menusMemo}
      />
    </Sider>
  );
}
