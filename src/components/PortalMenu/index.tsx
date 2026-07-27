import { Menu, Layout } from "antd";

import { SolutionOutlined } from "@ant-design/icons";

import p1Logo from "@/assets/images/p1_logo.png";
import p2Logo from "@/assets/images/p2_logo.png";
import useStore from "@/store";
import { useMemo, useState } from "react";
import useMenuOpenKeys from "@/hooks/useMenuOpenKeys";

const { Sider } = Layout;

const toMenuItems = (items: any[], depth = 0): any[] =>
  items.map((item) => ({
    key: item.code,
    icon: depth == 0 && <SolutionOutlined />,
    label: item.name,
    children:
      item.type === "ACTION" &&
      item.children?.length &&
      toMenuItems(item.children, depth + 1),
  }));

export default function PortalMenu({ collapsed }) {
  const { menus } = useStore();
  const [defaultSelectedKeys] = useState(["IMAS_Index"]); // 默认选中的菜单项
  const menusMemo = useMemo(() => toMenuItems(menus), [menus]); // 递归转换菜单数据
  const { stateOpenKeys, onOpenChange } = useMenuOpenKeys(menusMemo, []); // 获取菜单的 openKeys

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={collapsed ? 70 : 220}
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
        defaultSelectedKeys={defaultSelectedKeys}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        items={menusMemo}
      />
    </Sider>
  );
}
