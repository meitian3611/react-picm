import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { MenuItemConverted } from "@/types/portalStoreTypes";

// 根据 URL 递归查找匹配的完整 key 路径（从根到叶子）
const findKeyPath = (items: MenuItemConverted[], url: string): string[] => {
  for (const item of items) {
    if (item.type === "MENU" && !item.url && item.deepData) {
      // 二级菜单容器：deepData 子页面在菜单中不可见（渲染为二级 Tab），
      // 命中时选中容器自身即可，父级展开交给外层递归拼接
      const deepFound = findKeyPath(item.deepData, url);
      if (deepFound.length) return [item.key];
    }
    if (item.url === url) return [item.key];
    if (item.children) {
      const found = findKeyPath(item.children, url);
      if (found.length) return [item.key, ...found];
    }
  }
  return [];
};

// 递归查找子节点的 url：优先匹配 currentUrl，否则取第一个
function findFirstUrl(
  items: MenuItemConverted[],
  currentUrl?: string,
): string | undefined {
  // 先尝试匹配当前路由对应的子节点
  if (currentUrl) {
    const match = items.find((item) => item.url === currentUrl);
    if (match) return match.url;
  }
  // 兜底取第一个有 url 的子节点
  for (const item of items) {
    if (item.url) return item.url;
    if (item.children?.length) {
      const found = findFirstUrl(item.children, currentUrl);
      if (found) return found;
    }
  }
  return undefined;
}

// 根据 key 查找对应 url（如果自身没有，则取子节点的 url）
function findUrlByKey(
  items: MenuItemConverted[],
  key: string,
  currentUrl?: string,
): string | undefined {
  for (const item of items) {
    if (item.key === key) {
      return (
        item.url ||
        (item.deepData?.length
          ? findFirstUrl(item.deepData, currentUrl)
          : undefined)
      );
    }
    if (item.children) {
      const found = findUrlByKey(item.children, key, currentUrl);
      if (found) return found;
    }
  }
  return undefined;
}

// 根据 url 查找对应 item（子页面匹配时返回 MENU 容器父级）
function findKeyByUrl(
  items: MenuItemConverted[],
  url: string,
): MenuItemConverted | undefined {
  for (const item of items) {
    if (item.url === url) return item;
    if (item.deepData?.length) {
      const found = findKeyByUrl(item.deepData, url);
      if (found) return item;
    }
    if (item.children?.length) {
      const found = findKeyByUrl(item.children, url);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 根据当前 URL 从菜单数据中计算出选中项和父级展开项
 * @param menusMemo 转换后的菜单 items
 */
export default function useMenuSelection(menusMemo: MenuItemConverted[]) {
  const { pathname } = useLocation();

  const curUrl = pathname.slice(6); // 去掉 "/page/" 前缀
  const keyPath = useMemo(
    () => findKeyPath(menusMemo, curUrl),
    [menusMemo, curUrl],
  );
  // 菜单外的页面（如详情页）匹配不到菜单项时，不选中任何菜单（不再回退到首页）
  const selectedKeys = useMemo(() => {
    const lastKey = keyPath[keyPath.length - 1];
    return lastKey ? [lastKey] : [];
  }, [keyPath]);
  const parentKeys = useMemo(() => keyPath.slice(0, -1), [keyPath]);

  return { selectedKeys, parentKeys, findUrlByKey, findKeyByUrl };
}
