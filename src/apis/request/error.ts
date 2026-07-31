import type { ApiResponse } from "./types";

/**
 * 业务错误：后端返回了响应，但业务 code 非成功码
 */
export class BusinessError extends Error {
  code: number;
  data: unknown;

  constructor(res: ApiResponse) {
    super(res.message);
    this.name = "BusinessError";
    this.code = res.code;
    this.data = res.data;
  }
}

/**
 * HTTP / 网络错误：请求未拿到有效响应（超时、断网、非 2xx 状态码等）
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
