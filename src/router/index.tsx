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
      {
        path: "/page/my-portal",
        element: lazyLoad(() => import("@/pages/Solar/my-portal")),
      },
      {
        path: "/page/fvTaskList",
        element: lazyLoad(() => import("@/pages/Solar/fvTaskList")),
      },
      {
        path: "/page/period-management",
        element: lazyLoad(() => import("@/pages/Solar/period-management")),
      },
      {
        path: "/page/accountScene",
        element: lazyLoad(() => import("@/pages/Solar/accountScene")),
      },
      {
        path: "/page/accountTask",
        element: lazyLoad(() => import("@/pages/Solar/accountTask")),
      },
      {
        path: "/page/accountSceneMerge",
        element: lazyLoad(() => import("@/pages/Solar/accountSceneMerge")),
      },
      {
        path: "/page/accountTaskNoCash",
        element: lazyLoad(() => import("@/pages/Solar/accountTaskNoCash")),
      },
      {
        path: "/page/listingManage",
        element: lazyLoad(() => import("@/pages/Solar/listingManage")),
      },
      {
        path: "/page/bondLedgers",
        element: lazyLoad(() => import("@/pages/Solar/bondLedgers")),
      },
      {
        path: "/page/loanLedgers",
        element: lazyLoad(() => import("@/pages/Solar/loanLedgers")),
      },
      {
        path: "/page/solarAdmin",
        element: lazyLoad(() => import("@/pages/Solar/solarAdmin")),
      },
      {
        path: "/page/periodInvestType",
        element: lazyLoad(() => import("@/pages/Solar/periodInvestType")),
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - 未知页面</div>,
  },
]);

export default router;
