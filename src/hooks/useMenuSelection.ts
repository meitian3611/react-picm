import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// 根据 URL 递归查找匹配的完整 key 路径（从根到叶子）
const findKeyPath = (items: any[], url: string): string[] => {
  for (const item of items) {
    if (item.url === url) return [item.key];
    if (item.children) {
      const found = findKeyPath(item.children, url);
      if (found.length) return [item.key, ...found];
    }
  }
  return [];
};

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

  // 递归查找子树中第一个有 url 的节点
  const findFirstUrl = (items: any[]): string | undefined => {
    for (const item of items) {
      if (item.url) return item.url;
      if (item.children?.length) {
        const found = findFirstUrl(item.children);
        if (found) return found;
      }
    }
  };

  // 根据 key 查找对应 url（如果自身没有，则取第一个子节点的 url）
  const findUrlByKey = (items: any[], key: string): string | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return (
          item.url || (item.deepData?.length && findFirstUrl(item.deepData))
        );
      }
      if (item.children) {
        const found = findUrlByKey(item.children, key);
        if (found) return found;
      }
    }
  };

  return { selectedKeys, parentKeys, findUrlByKey };
}
