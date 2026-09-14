/** 核算场景判断-列表行数据（对应 db.json → scenePage.data.data） */
export interface ScenePageRow {
  mainMatterId: string | null;
  sceneId: string;
  sceneCode: string | null;
  isTranScene: string;
  periodId: string;
  category: string;
  singleSceneId: string | null;
  dataSource: string;
  matterId: string;
  matterName: string;
  matterPullTime: string | null;
  projectId: string;
  projectName: string;
  owner: string | null;
  leader: string;
  sceneStatus: string;
  sceneEndTime: string | null;
  singleSceneOwner: string;
  singleProcessOwner: string;
  singleReviewOwner: string;
  singleNeedAcc: string;
  singleAccTaskPkgId: string;
  singleAccTaskPkgName: string;
  singleAccTaskStatus: string;
  combineSceneOwner: string | null;
  combineProcessOwner: string | null;
  combineReviewOwner: string | null;
  combineNeedAcc: string | null;
  combineAccTaskPkgId: string | null;
  combineAccTaskPkgName: string | null;
  combineAccTaskStatus: string | null;
  singleAccYesOrNo: string | null;
  mergerAccYesOrNo: string | null;
  matterTypeCode: string | null;
  matterTypeName: string | null;
  rowNum: string;
}

/** 核算场景判断-列表查询参数（业务筛选条件 + 分页） */
export interface ScenePageParams {
  pageNum: number;
  pageSize: number;
  [key: string]: unknown;
}

/** 核算场景判断-列表接口返回（已由响应拦截器解包） */
export interface ScenePageResult {
  data: ScenePageRow[];
  total: number;
}
