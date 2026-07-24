import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/router";

import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import "./init.scss";

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>,
);
