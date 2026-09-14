import request from "@/apis/request";
import type {
  ScenePageParams,
  ScenePageResult,
} from "@/types/accountSceneTypes";

/** 核算场景判断-分页查询列表 */
export function getScenePage(params: ScenePageParams) {
  return request.get<ScenePageResult>("/scenePage", { params });
}
