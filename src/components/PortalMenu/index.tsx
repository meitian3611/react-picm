import { Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";

import p1Logo from "@/assets/images/p1_logo.png";
import p2Logo from "@/assets/images/p2_logo.png";
import useStore from "@/store";
import useMenuOpenKeys from "@/hooks/useMenuOpenKeys";
import useMenuSelection from "@/hooks/useMenuSelection";

const { Sider } = Layout;

export default function PortalMenu({ collapsed }) {
  const navigate = useNavigate();
  const { menusItems } = useStore();

  const { selectedKeys, parentKeys, findUrlByKey } =
    useMenuSelection(menusItems);
  const { stateOpenKeys, onOpenChange } = useMenuOpenKeys(
    menusItems,
    parentKeys,
  );

  const menuClick = (info: { key: string }) => {
    const url = findUrlByKey(menusItems, info.key);
    if (url) {
      navigate(`/page/${url}`);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={collapsed ? 80 : 240}
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
        items={menusItems}
      />
    </Sider>
  );
}
