import request from "@/apis/request";
import type { Menu, User } from "@/types/portalStoreTypes";

/** 获取用户信息 */
export function getStaffInfo() {
  return request.get<User>("/Default/getStaffInfo");
}

/** 获取左侧菜单 */
export function getMenus() {
  return request.get<Menu[]>("/Menus/GetMenus");
}
