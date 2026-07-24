import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

import Portal from "@/pages/Portal";

// 封装懒加载组件
export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType }>,
) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Outlet />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Portal />,
    children: [
      {
        path: "",
        element: <Navigate to="/page/index" />, // 默认重定向打开 /page/index
      },
      {
        path: "/page/index",
        element: lazyLoad(() => import("@/pages/Home")),
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - 未知页面</div>,
  },
]);

export default router;
