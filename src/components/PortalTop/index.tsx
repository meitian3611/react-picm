import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Space, Flex, Avatar, Layout, theme } from "antd";
import type { MenuProps } from "antd";

const { Header } = Layout;
export default function PortalTop({ collapsed, setCollapsed }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "退出账号",
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      <div className="portal-header">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />

        <Flex gap="small" align="center">
          <div className="userAvatar">
            <Avatar
              icon={<UserOutlined />}
              src="https://rhrc.woa.com/photo/150/v_tianmei.png"
            />
          </div>
          <div className="dropDownsClass">
            <div className="title">User</div>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className="drop-down">
                <Space>
                  v_tianmei
                  <DownOutlined></DownOutlined>
                </Space>
              </div>
            </Dropdown>
          </div>
        </Flex>
      </div>
    </Header>
  );
}
