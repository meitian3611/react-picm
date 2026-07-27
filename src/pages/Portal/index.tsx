import { useState, useEffect } from "react";
import { Layout, theme } from "antd";
import { Outlet } from "react-router-dom";
import "./index.scss";
import useStore from "@/store";

import PortalMenu from "@/components/PortalMenu";
import PortalTop from "@/components/PortalTop";

const { Content, Footer } = Layout;

const Portal = () => {
  const [collapsed, setCollapsed] = useState(false); // 是否折叠
  const { fetchUserInfo, fetchMenus } = useStore(); // 获取当前用户与菜单数据
  useEffect(() => {
    fetchUserInfo();
    fetchMenus();
  }, [fetchUserInfo, fetchMenus]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100dvh" }}>
      {/* Portal 左侧菜单 */}
      <PortalMenu collapsed={collapsed} />

      <Layout>
        {/* Portal 顶部导航 */}
        <PortalTop collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* 页面主内容入口 */}
        <Content
          style={{
            margin: "10px 10px 0",
            padding: 10,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

        {/* 页面底部信息 */}
        <Footer style={{ textAlign: "center", padding: "10px" }}>
          Ant Design ©2026 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Portal;
