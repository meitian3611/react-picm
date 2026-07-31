import { Menu, Layout } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

import p1Logo from "@/assets/images/p1_logo.png";
import p2Logo from "@/assets/images/p2_logo.png";
import useStore from "@/store";
import useMenuOpenKeys from "@/hooks/useMenuOpenKeys";
import useMenuSelection from "@/hooks/useMenuSelection";
import type { MenuItemConverted } from "@/types/portalStoreTypes";

const { Sider } = Layout;

interface PortalMenuProps {
  collapsed: boolean;
}

export default function PortalMenu({ collapsed }: PortalMenuProps) {
  const navigate = useNavigate();
  const menusItems = useStore((state) => state.menusItems);
  const addTabList = useStore((state) => state.addTabList);

  const { selectedKeys, parentKeys, findUrlByKey } =
    useMenuSelection(menusItems);
  const { stateOpenKeys, onOpenChange } = useMenuOpenKeys(
    menusItems,
    parentKeys,
  );

  const menuClick: MenuProps["onClick"] = (info) => {
    // itemData 依赖 antd Menu 对 items 原始字段的透传
    const itemData = (
      info as unknown as { itemData?: MenuItemConverted }
    ).itemData;
    if (!itemData) return;
    const { key, label, url, deepData } = itemData;
    addTabList({ key, label, url, deepData });

    const pageUrl = findUrlByKey(menusItems, key);
    if (pageUrl) {
      navigate(`/page/${pageUrl}`);
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
        <div className="lg-logo" style={{ display: collapsed ? "none" : undefined }}>
          <img src={p1Logo} width={100} height={33} alt="logo" />
          <span className="text">imas.woa.com</span>
        </div>
        <img
          src={p2Logo}
          width={54}
          height={18}
          alt="logo"
          style={{ display: !collapsed ? "none" : undefined }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={menuClick}
        items={menusItems as MenuProps["items"]}
      />
    </Sider>
  );
}
