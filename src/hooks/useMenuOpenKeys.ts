import { useState } from "react";
import type { MenuProps } from "antd";

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items);
  return key;
};

/**
 * 左侧菜单的展开逻辑
 * @param menusMemo 菜单 items 数据
 * @param parentKeys 当前选中项的所有父级 key（导航时自动展开）
 */
export default function useMenuOpenKeys(
  menusMemo: LevelKeysProps[],
  parentKeys: string[] = [],
) {
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(parentKeys);
  const [prevParentKeys, setPrevParentKeys] = useState<string[]>(parentKeys);
  const levelKeys = getLevelKeys(menusMemo);

  // 导航到新 URL 时，合并新的 parentKeys（render 时同步，无 useEffect 级联）
  if (parentKeys !== prevParentKeys) {
    setPrevParentKeys(parentKeys);
    setStateOpenKeys((prev) => [...new Set([...prev, ...parentKeys])]);
  }

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
    if (currentOpenKey !== undefined) {
      // 打开一个菜单 → 同级互斥
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // 关闭一个菜单
      setStateOpenKeys(openKeys);
    }
  };

  return { stateOpenKeys, onOpenChange };
}
