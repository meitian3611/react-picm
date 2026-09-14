/** 选项结构：value 为接口返回的码值，label 为页面展示文案（搜索下拉与表格列共用） */
export interface OptionItem {
  label: string;
  value: string;
}

/** 数据来源 —— 对应字段 dataSource */
export const DATA_SOURCE_OPTIONS: OptionItem[] = [
  { label: "不限", value: "" },
  { label: "投资管理模块", value: "INVEST" },
  { label: "基金模块", value: "FUND" },
  { label: "单家手工数据", value: "COMBINE_MANUAL" },
];

/** 核算场景判断状态 —— 对应字段 sceneStatus */
export const SCENE_STATUS_OPTIONS: OptionItem[] = [
  { label: "不限", value: "" },
  { label: "已完成", value: "FINISHED" },
  { label: "未完成", value: "NOT_FINISHED" },
];

/** 核算任务包处理状态 —— 对应字段 singleAccTaskStatus */
export const ACC_TASK_STATUS_OPTIONS: OptionItem[] = [
  { label: "不限", value: "" },
  { label: "已处理", value: "DONE" },
  { label: "未处理", value: "TODO" },
];
