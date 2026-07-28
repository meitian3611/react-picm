import React from "react";
import { SolutionOutlined } from "@ant-design/icons";

export const toMenuItems = (items: any[], depth = 0): any[] =>
  items.map((item) => ({
    key: item.code,
    icon: depth === 0 ? React.createElement(SolutionOutlined) : undefined,
    label: item.name,
    url: item.url,
    type: item.type,
    children:
      item.type === "ACTION" &&
      item.children?.length &&
      toMenuItems(item.children, depth + 1),
    deepData:
      item.type === "MENU" &&
      item.children?.length &&
      !item.url &&
      toMenuItems(item.children, depth + 1),
  }));
