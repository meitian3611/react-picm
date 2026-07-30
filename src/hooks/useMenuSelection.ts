import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// 根据 key 递归查找父级 key
const getParentKey = (items: any[], key: string) => {
  for (const item of items) {
    if (item.key === key) {
      return item.key;
    }
    if (item.children) {
      const found = getParentKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

// 根据 URL 递归查找匹配的完整 key 路径（从根到叶子）
const findKeyPath = (items: any[], url: string): string[] => {
  for (const item of items) {
    if (item.type === "MENU" && !item.url && item.deepData) {
      // 特殊处理 二级菜单
      const deepFound = findKeyPath(item.deepData, url);
      if (deepFound.length) {
        const fatherKey = getParentKey(items, item.key);
        return [fatherKey];
      }
    }
    if (item.url === url) return [item.key];
    if (item.children) {
      const found = findKeyPath(item.children, url);
      if (found.length) return [item.key, ...found];
    }
  }
  return [];
};

// 递归查找子树中第一个有 url 的节点
function findFirstUrl(items: any[]): string | undefined {
  for (const item of items) {
    if (item.url) return item.url;
    if (item.children?.length) {
      const found = findFirstUrl(item.children);
      if (found) return found;
    }
  }
}

// 根据 key 查找对应 url（如果自身没有，则取第一个子节点的 url）
function findUrlByKey(items: any[], key: string): string | undefined {
  for (const item of items) {
    if (item.key === key) {
      return item.url || (item.deepData?.length && findFirstUrl(item.deepData));
    }
    if (item.children) {
      const found = findUrlByKey(item.children, key);
      if (found) return found;
    }
  }
}

// 根据 url 查找对应 item（子页面匹配时返回 MENU 容器父级）
function findKeyByUrl(items: any[], url: string): any | undefined {
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
}

/**
 * 根据当前 URL 从菜单数据中计算出选中项和父级展开项
 * @param menusMemo 转换后的菜单 items
 */
export default function useMenuSelection(menusMemo: any[]) {
  const { pathname } = useLocation();

  const curUrl = pathname.slice(6); // 去掉 "/page/" 前缀
  const keyPath = useMemo(
    () => findKeyPath(menusMemo, curUrl),
    [menusMemo, curUrl],
  );
  const selectedKeys = useMemo(
    () => [keyPath[keyPath.length - 1] ?? "IMAS_Index"],
    [keyPath],
  );
  const parentKeys = useMemo(() => keyPath.slice(0, -1), [keyPath]);

  return { selectedKeys, parentKeys, findUrlByKey, findKeyByUrl };
}
