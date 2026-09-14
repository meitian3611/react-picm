import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";

interface KeyedBySearchProps {
  /** 需要按地址栏 query 重新挂载的页面组件 */
  Component: ComponentType;
}

/**
 * 以地址栏 query 为 key 渲染页面
 *
 * 参数不同即视为不同页面：query 变化时旧实例卸载、新实例挂载，
 * 从而重新触发挂载期的加载逻辑（如接口请求）。
 */
export default function KeyedBySearch({ Component }: KeyedBySearchProps) {
  const { search } = useLocation();
  return <Component key={search} />;
}
