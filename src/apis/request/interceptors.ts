import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";
import { SUCCESS_CODE, HttpStatus } from "../constants";
import type { ApiResponse } from "./types";
import { BusinessError, HttpError } from "./error";

/**
 * 请求拦截器：统一注入 token 等公共 header
 *
 * 注：token 存储位置按需调整（localStorage / cookie / 状态库）。
 */
export function setupRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
}

/**
 * 响应拦截器：统一处理业务码、错误提示与 HTTP 异常
 *
 * - 业务成功（code === SUCCESS_CODE 或后端未返回 code）→ 解包返回 res.data
 * - 业务失败（code 非 0）→ 弹出提示并 reject BusinessError
 * - HTTP/网络错误 → 弹出提示并 reject HttpError，401 时清除登录态
 *
 * 注：直接使用 antd 静态 message。若需继承 ConfigProvider 的主题/上下文，
 * 可改为通过 App.useApp() 注入 message 实例。
 */
export function setupResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => {
      const res = response.data as ApiResponse;
      // 有业务码且非成功 → 业务错误
      if (res.code !== undefined && res.code !== SUCCESS_CODE) {
        message.error(res.message || "请求失败");
        return Promise.reject(new BusinessError(res));
      }
      // 成功（含后端未返回 code 的兼容场景）：解包返回业务数据
      return res.data as unknown as AxiosResponse;
    },
    (error) => {
      const status = error.response?.status;
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "网络异常，请稍后重试";

      if (status === HttpStatus.UNAUTHORIZED) {
        localStorage.removeItem("token");
        message.error("登录已过期，请重新登录");
        // window.location.href = "/login"; // 按需启用
      } else {
        message.error(errorMsg);
      }

      return Promise.reject(new HttpError(status ?? -1, errorMsg));
    },
  );
}
