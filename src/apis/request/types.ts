import type { AxiosRequestConfig } from "axios";

/**
 * 后端统一响应结构
 *
 * 约定后端返回 `{ code, data, message }`，业务成功码为 0。
 * 若实际后端结构不同，调整 `constants.ts` 的 `SUCCESS_CODE`
 * 与拦截器中的判断逻辑即可。
 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 扩展的请求配置：支持业务层定制拦截器行为
 */
export interface RequestConfig extends AxiosRequestConfig {
  /** 是否在业务错误时自动弹出错误提示，默认 true */
  showError?: boolean;
  /** 是否在网络/HTTP 错误时自动弹出错误提示，默认 true */
  showNetworkError?: boolean;
}
