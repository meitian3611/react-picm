import dayjs from "dayjs";
import { Button, Typography } from "antd";
import type { TableProps } from "antd";
import type { ScenePageRow } from "@/types/accountSceneTypes";
import {
  ACC_TASK_STATUS_OPTIONS,
  DATA_SOURCE_OPTIONS,
  SCENE_STATUS_OPTIONS,
} from "./constants";
import type { OptionItem } from "./constants";

/** 日期列展示格式 */
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

/** 日期列统一格式化，空值显示 - */
const renderDateTime = (value: string | null) =>
  value ? dayjs(value).format(DATE_TIME_FORMAT) : "-";

/** 生成「码值 → 展示文案」的列渲染函数，未匹配到的码值原样展示 */
const createOptionRender = (options: OptionItem[]) => (value: string) =>
  options.find((item) => item.value === value)?.label ?? value;

const renderDataSource = createOptionRender(DATA_SOURCE_OPTIONS);
const renderSceneStatus = createOptionRender(SCENE_STATUS_OPTIONS);
const renderAccTaskStatus = createOptionRender(ACC_TASK_STATUS_OPTIONS);

/** 列事件由页面注入 */
export interface AccountSceneColumnHandlers {
  /** 点击编辑 */
  onEdit: (row: ScenePageRow) => void;
  /** 点击单家核算任务包名称，跳转详情 */
  onViewTaskPkg: (row: ScenePageRow) => void;
}

// 核算场景判断-首页列表
export const getAccountSceneColumn = ({
  onEdit,
  onViewTaskPkg,
}: AccountSceneColumnHandlers): TableProps<ScenePageRow>["columns"] => [
  {
    title: "账期",
    dataIndex: "periodId",
    key: "periodId",
    ellipsis: true,
  },
  {
    title: "数据来源",
    dataIndex: "dataSource",
    key: "dataSource",
    ellipsis: true,
    render: renderDataSource,
  },
  {
    title: "单家核算任务包名称",
    dataIndex: "singleAccTaskPkgName",
    key: "singleAccTaskPkgName",
    width: 240,
    ellipsis: true,
    render: (value: string, record: ScenePageRow) =>
      value ? (
        <Typography.Link onClick={() => onViewTaskPkg(record)}>
          {value}
        </Typography.Link>
      ) : (
        "-"
      ),
  },
  {
    title: "投资事项号",
    dataIndex: "matterId",
    key: "matterId",
    width: 200,
    ellipsis: true,
  },
  {
    title: "投资事项名称",
    dataIndex: "matterName",
    key: "matterName",
    width: 200,
    ellipsis: true,
  },
  {
    title: "投资公司项目名称",
    dataIndex: "projectName",
    key: "projectName",
    width: 200,
    ellipsis: true,
  },
  {
    title: "项目owner",
    dataIndex: "owner",
    key: "owner",
    ellipsis: true,
  },
  {
    title: "事项同步时间",
    dataIndex: "matterPullTime",
    key: "matterPullTime",
    width: 200,
    ellipsis: true,
    render: renderDateTime,
  },
  {
    title: "核算场景判断状态",
    dataIndex: "sceneStatus",
    key: "sceneStatus",
    ellipsis: true,
    render: renderSceneStatus,
  },
  {
    title: "核算场景判断完成时间",
    dataIndex: "sceneEndTime",
    key: "sceneEndTime",
    width: 200,
    ellipsis: true,
    render: renderDateTime,
  },
  {
    title: "单家判断人",
    dataIndex: "singleSceneOwner",
    key: "singleSceneOwner",
    ellipsis: true,
  },
  {
    title: "单家是否需要核算",
    dataIndex: "singleNeedAcc",
    key: "singleNeedAcc",
    ellipsis: true,
  },
  {
    title: "单家核算任务处理人",
    dataIndex: "singleProcessOwner",
    key: "singleProcessOwner",
    ellipsis: true,
  },
  {
    title: "单家核算任务复核人",
    dataIndex: "singleReviewOwner",
    key: "singleReviewOwner",
    ellipsis: true,
  },
  {
    title: "单家核算任务包处理状态",
    dataIndex: "singleAccTaskStatus",
    key: "singleAccTaskStatus",
    width: 200,
    ellipsis: true,
    render: renderAccTaskStatus,
  },
  {
    title: "操作",
    key: "action",
    width: 100,
    fixed: "right",
    render: (_, record) => (
      <Button type="link" size="small" onClick={() => onEdit(record)}>
        编辑
      </Button>
    ),
  },
];
