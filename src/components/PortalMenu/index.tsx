import { Menu, Layout } from "antd";

import { UserOutlined } from "@ant-design/icons";

import p1Logo from "@/assets/images/p1_logo.png";
import p2Logo from "@/assets/images/p2_logo.png";
import useStore from "@/store";

const { Sider } = Layout;
export default function PortalMenu({ collapsed }) {
  const { menus } = useStore(); // 获取菜单数据

  console.log(menus);
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
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <UserOutlined />,
            label: "nav 1",
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: "nav 2",
          },
          {
            key: "3",
            icon: <UserOutlined />,
            label: "nav 3",
          },
        ]}
      />
    </Sider>
  );
}
