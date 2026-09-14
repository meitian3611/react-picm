import { useEffect, useRef, useState } from "react";

/** 元素占用的垂直空间（含上下 margin） */
const getOuterHeight = (el: HTMLElement | null) => {
  if (!el) return 0;
  const style = getComputedStyle(el);
  return (
    el.offsetHeight +
    parseFloat(style.marginTop || "0") +
    parseFloat(style.marginBottom || "0")
  );
};

/** 不参与滚动、需要从可用高度中扣除的表格内部结构（表头 / 分页栏） */
const RESERVE_SELECTORS = [".ant-table-thead", ".ant-table-pagination"];

/** 默认底部边界：应用页脚，避免表格压到底部之外 */
const DEFAULT_BOTTOM_SELECTOR = ".ant-layout-footer";

/** 默认内容区最小高度 */
const DEFAULT_MIN_HEIGHT = 120;

export interface UseTableHeightOptions {
  /** 内容区最小高度，默认 120 */
  minHeight?: number;
  /** 底部边界元素选择器，其高度会计入预留；传空字符串表示不预留，默认取页脚 */
  bottomSelector?: string;
  /** 额外需要预留的底部高度，默认 0 */
  offsetBottom?: number;
}

/**
 * 表格高度自适应
 *
 * 把返回的 `wrapRef` 挂到表格外层容器上，`scrollY` 传给 antd Table 的 `scroll.y`，
 * antd 会自动把表头渲染到独立容器中，实现表头冻结：
 *
 * ```tsx
 * const { wrapRef, scrollY } = useTableHeight();
 *
 * <div ref={wrapRef}>
 *   <Table scroll={{ x: "max-content", y: scrollY }} />
 * </div>
 * ```
 *
 * 高度 = 视口高度 - 容器顶部距离 - 底部边界高度 - 表头/分页栏高度，
 * 容器尺寸变化（数据增减、窗口缩放等）时通过 ResizeObserver 自动重算。
 */
export default function useTableHeight({
  minHeight = DEFAULT_MIN_HEIGHT,
  bottomSelector = DEFAULT_BOTTOM_SELECTOR,
  offsetBottom = 0,
}: UseTableHeightOptions = {}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState<number>();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const updateScrollY = () => {
      const boundaryHeight = bottomSelector
        ? (document.querySelector<HTMLElement>(bottomSelector)?.clientHeight ??
          0)
        : 0;
      // 可用高度 = 视口高度 - 容器顶部距离 - 底部边界 - 额外预留
      const available =
        document.documentElement.clientHeight -
        wrap.getBoundingClientRect().top -
        boundaryHeight -
        offsetBottom;
      const reserve = RESERVE_SELECTORS.reduce(
        (total, selector) =>
          total + getOuterHeight(wrap.querySelector<HTMLElement>(selector)),
        0,
      );

      setScrollY(Math.max(Math.floor(available - reserve), minHeight));
    };

    const observer = new ResizeObserver(updateScrollY);
    observer.observe(wrap);
    window.addEventListener("resize", updateScrollY);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScrollY);
    };
  }, [minHeight, bottomSelector, offsetBottom]);

  return { wrapRef, scrollY };
}
