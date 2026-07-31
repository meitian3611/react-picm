import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { setupRequestInterceptor, setupResponseInterceptor } from "./interceptors";
import type { RequestConfig } from "./types";

/**
 * 基于 axios 的请求封装：
 * - 统一注入 token、统一错误处理（见 interceptors.ts）
 * - 响应自动解包业务数据，调用方直接拿到 T 而非 ApiResponse<T>
 *
 * 用法：request.get<User>("/xxx") => Promise<User>
 */
class Request {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    setupRequestInterceptor(this.instance);
    setupResponseInterceptor(this.instance);
  }

  /** 通用请求，返回解包后的业务数据 */
  request<T = unknown>(config: RequestConfig): Promise<T> {
    return this.instance.request<unknown, T>(config);
  }

  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get<unknown, T>(url, config);
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.post<unknown, T>(url, data, config);
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    return this.instance.put<unknown, T>(url, data, config);
  }

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete<unknown, T>(url, config);
  }
}

/** 默认请求实例 */
const request = new Request({
  baseURL: "/api",
  timeout: 10000,
});

export default request;
export { Request };
