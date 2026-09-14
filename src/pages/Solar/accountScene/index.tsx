import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Key } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import {
  ExportOutlined,
  ScheduleOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { getScenePage } from "@/apis";
import useTableHeight from "@/hooks/useTableHeight";
import type { ScenePageParams, ScenePageRow } from "@/types/accountSceneTypes";
import { getAccountSceneColumn } from "./columns";
import {
  ACC_TASK_STATUS_OPTIONS,
  DATA_SOURCE_OPTIONS,
  SCENE_STATUS_OPTIONS,
} from "./constants";
import "./index.scss";

/** 筛选项标签统一宽度，保证多列对齐 */
const LABEL_FLEX = "0 0 160px";

/** 日期类字段的格式化规则：账期按月、完成时间范围按日 */
const DATE_FORMAT_MAP: Record<string, string> = {
  period: "YYYY-MM",
  judgeFinishTime: "YYYY-MM-DD",
};

/**
 * 表单值转查询参数
 * - 日期按 DATE_FORMAT_MAP 格式化，日期范围按逗号拼接成字符串
 * - 其余字段统一转成字符串，未填写时默认为空串
 */
const normalizeParams = (values: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]): [string, string] => {
      const dateFormat = DATE_FORMAT_MAP[key];
      if (!dateFormat) {
        return [key, (value as string) ?? ""];
      }

      if (Array.isArray(value)) {
        const range = value
          .filter((item) => dayjs.isDayjs(item))
          .map((item) => (item as Dayjs).format(dateFormat));
        // 日期范围按逗号拼接，如 "2026-08-01,2026-08-31"
        return [key, range.join(",")];
      }

      return [key, dayjs.isDayjs(value) ? value.format(dateFormat) : ""];
    }),
  );

/** 默认每页条数 */
const DEFAULT_PAGE_SIZE = 20;

/** 单家核算任务包详情页路由 */
const TASK_PKG_DETAIL_PATH = "/page/sceneDetails";

/** 账期 ID（如 202608）转 dayjs 对象，格式异常返回 undefined */
const toPeriodDate = (periodId: string | null) =>
  periodId && /^\d{6}$/.test(periodId)
    ? dayjs(`${periodId.slice(0, 4)}-${periodId.slice(4, 6)}-01`)
    : undefined;

export default function AccountScene() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [list, setList] = useState<ScenePageRow[]>([]);
  const [loading, setLoading] = useState(false);
  // 勾选的行（左侧固定 checkbox 列）
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  // 编辑弹窗
  const [editOpen, setEditOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ScenePageRow | null>(null);
  // 表格高度自适应（scroll.y 就位后 antd 会自动冻结表头）
  const { wrapRef, scrollY } = useTableHeight();
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  // 最近一次查询条件（不含分页），翻页时复用
  const conditionsRef = useRef<Record<string, string>>({});

  /** 查询列表 */
  const fetchList = useCallback(
    async (
      pageNum: number,
      pageSize: number,
      conditions: Record<string, string>,
    ) => {
      setLoading(true);
      try {
        const params: ScenePageParams = { ...conditions, pageNum, pageSize };
        const { data = [], total = 0 } = await getScenePage(params);
        setList(data);
        // mock 接口 total 为 0 时兜底为当前页条数
        setPagination({ pageNum, pageSize, total: total || data.length });
      } catch {
        // 错误提示已由请求拦截器统一处理
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // 首次进入加载列表
  useEffect(() => {
    conditionsRef.current = normalizeParams(form.getFieldsValue());
    // 初始化请求需要同步开启 loading，此处例外
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList(1, DEFAULT_PAGE_SIZE, conditionsRef.current);
  }, [fetchList, form]);

  /** 查询：条件变更后回到第一页 */
  const handleSearch = () => {
    form.validateFields().then((values) => {
      conditionsRef.current = normalizeParams(values);
      fetchList(1, pagination.pageSize, conditionsRef.current);
    });
  };

  /** 重置：清空条件后重新查询 */
  const handleReset = () => {
    form.resetFields();
    conditionsRef.current = normalizeParams(form.getFieldsValue());
    fetchList(1, pagination.pageSize, conditionsRef.current);
  };

  /** 表格勾选变化 */
  const handleSelectChange = (keys: Key[], rows: ScenePageRow[]) => {
    setSelectedRowKeys(keys);
    console.log("勾选的数据：", rows);
  };

  /** 点击编辑：打开弹窗并回填账期 */
  const handleEdit = useCallback(
    (row: ScenePageRow) => {
      setEditingRow(row);
      editForm.setFieldsValue({ period: toPeriodDate(row.periodId) });
      setEditOpen(true);
    },
    [editForm],
  );

  /** 编辑弹窗确定：打印修改后的账期（保存接口未接入） */
  const handleEditSubmit = () => {
    editForm.validateFields().then((values) => {
      const period = values.period as Dayjs | undefined;
      console.log("编辑保存：", {
        sceneId: editingRow?.sceneId,
        periodId: period ? period.format("YYYYMM") : "",
      });
      setEditOpen(false);
    });
  };

  const handleEditCancel = () => {
    setEditOpen(false);
  };

  /** 点击单家核算任务包名称：携带标签名与业务 ID 跳转详情页 */
  const handleViewTaskPkg = useCallback(
    (row: ScenePageRow) => {
      const search = new URLSearchParams({
        cName: row.singleAccTaskPkgName,
        sceneId: row.sceneId,
        singleAccTaskPkgId: row.singleAccTaskPkgId,
      });
      navigate(`${TASK_PKG_DETAIL_PATH}?${search.toString()}`);
    },
    [navigate],
  );

  /** 列表列配置 */
  const columns = useMemo(
    () =>
      getAccountSceneColumn({
        onEdit: handleEdit,
        onViewTaskPkg: handleViewTaskPkg,
      }),
    [handleEdit, handleViewTaskPkg],
  );

  /** 翻页 / 切换每页条数 */
  const handlePageChange = (pageNum: number, pageSize: number) => {
    fetchList(pageNum, pageSize, conditionsRef.current);
  };

  return (
    <div className="account-scene">
      {/* 搜索区域 */}
      <Form
        className="account-scene__form"
        form={form}
        labelAlign="right"
        labelCol={{ flex: LABEL_FLEX }}
        colon={false}
        initialValues={{ period: dayjs("2026-08-01") }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="dataSource" label="数据来源">
              <Select
                placeholder="不限"
                allowClear
                options={DATA_SOURCE_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="period" label="账期">
              <DatePicker
                className="account-scene__picker"
                picker="month"
                format="YYYY-MM"
                placeholder="请选择"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="investProjectName" label="投资公司项目名称">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="judgeFinishTime" label="核算场景判断完成时间">
              <DatePicker.RangePicker
                className="account-scene__picker"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="projectOwner" label="单家判断人">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="judgeStatus" label="核算场景判断状态">
              <Select
                placeholder="不限"
                allowClear
                options={SCENE_STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="taskHandler" label="单家核算任务处理人">
              <Input placeholder="请输入" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="taskStatus" label="核算任务包处理状态">
              <Select
                placeholder="不限"
                allowClear
                options={ACC_TASK_STATUS_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Divider className="account-scene__divider account-scene__divider--spaced" />

      {/* 明细标题 + 操作按钮区域 */}
      <Row
        className="account-scene__header"
        justify="space-between"
        align="middle"
      >
        <Col>
          <span className="account-scene__title">核算场景全量判断明细</span>
        </Col>
        <Col>
          <Space size={12}>
            <Button onClick={handleReset}>重置</Button>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<UserOutlined />}>变更判断人</Button>
            <Button icon={<ScheduleOutlined />}>月度定稿</Button>
            <Button icon={<UploadOutlined />}>上传手工数据</Button>
          </Space>
        </Col>
      </Row>

      <Divider className="account-scene__divider" />

      {/* 明细表格 */}
      <div className="account-scene__table-wrap" ref={wrapRef}>
        <Table<ScenePageRow>
          className="account-scene__table"
          rowKey="sceneId"
          loading={loading}
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange: handleSelectChange,
          }}
          columns={columns}
          dataSource={list}
          scroll={{ x: "max-content", y: scrollY }}
          pagination={{
            current: pagination.pageNum,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [20, 40, 80, 150],
            showTotal: (total) => `共 ${total} 条`,
            onChange: handlePageChange,
          }}
        />
      </div>

      {/* 编辑弹窗：修改账期 */}
      <Modal
        title="编辑"
        open={editOpen}
        forceRender
        width={480}
        okText="确定"
        cancelText="取消"
        onOk={handleEditSubmit}
        onCancel={handleEditCancel}
      >
        <Form form={editForm} labelCol={{ flex: "0 0 80px" }} colon={false}>
          <Form.Item
            name="period"
            label="账期"
            rules={[{ required: true, message: "请选择账期" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              picker="month"
              format="YYYY-MM"
              placeholder="请选择"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
