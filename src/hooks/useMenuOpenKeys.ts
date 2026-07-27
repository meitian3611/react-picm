import { useState, useMemo } from "react";
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
 * @param defaultKeys 默认展开的 key 列表
 */
export default function useMenuOpenKeys(
  menusMemo: LevelKeysProps[],
  defaultKeys: string[] = [],
) {
  const levelKeys = useMemo(() => getLevelKeys(menusMemo), [menusMemo]);

  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(defaultKeys);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => !stateOpenKeys.includes(key));
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  return { stateOpenKeys, onOpenChange };
}
