import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import Portal from "@/pages/Portal";

interface LazyLoadOptions {
  /**
   * 是否按地址栏 query 作为 key
   * true 时「参数不同视为不同页面」：query 变化会重新挂载组件，重新触发页面加载
   */
  keyBySearch?: boolean;
}

/** 以地址栏 query 为 key 渲染页面，query 变化时旧实例卸载、新实例挂载 */
function KeyedBySearch({ Component }: { Component: React.ComponentType }) {
  const { search } = useLocation();
  return <Component key={search} />;
}

// 封装懒加载组件
export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType }>,
  { keyBySearch = false }: LazyLoadOptions = {},
) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Outlet />}>
      {keyBySearch ? <KeyedBySearch Component={Component} /> : <Component />}
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
        path: "/page/sceneDetails",
        // 详情页按参数区分：query 变化时重新挂载，重新触发页面加载
        element: lazyLoad(() => import("@/pages/Solar/sceneDetails"), {
          keyBySearch: true,
        }),
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
        path: "/page/accountMergeList",
        element: lazyLoad(() => import("@/pages/Solar/accountMergeList")),
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
      {
        path: "/page/solarFinalRightOs",
        element: lazyLoad(() => import("@/pages/Solar/solarFinalRightOs")),
      },
      {
        path: "/page/investmentAuxSegment",
        element: lazyLoad(() => import("@/pages/Solar/investmentAuxSegment")),
      },
    ],
  },
  {
    path: "*",
    element: <div>404 - 未知页面</div>,
  },
]);

export default router;
