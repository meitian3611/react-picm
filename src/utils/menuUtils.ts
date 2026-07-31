import React from "react";
import { SolutionOutlined } from "@ant-design/icons";
import type { Menu, MenuItemConverted } from "@/types/portalStoreTypes";

export const toMenuItems = (items: Menu[], depth = 0): MenuItemConverted[] =>
  items.map((item) => ({
    key: item.code,
    icon: depth === 0 ? React.createElement(SolutionOutlined) : undefined,
    label: item.name,
    url: item.url,
    type: item.type,
    children:
      item.type === "ACTION" && item.children && item.children.length > 0
        ? toMenuItems(item.children, depth + 1)
        : undefined,
    deepData:
      item.type === "MENU" &&
      item.children &&
      item.children.length > 0 &&
      !item.url
        ? toMenuItems(item.children, depth + 1)
        : undefined,
  }));
