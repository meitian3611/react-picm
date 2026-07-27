import request from "@/apis/request";

// 获取用户信息
export async function getStaffInfo() {
  return await request.get("/Default/getStaffInfo");
}

// 获取左侧菜单
export async function getMenus() {
  return await request.get("/Menus/GetMenus");
}
