/**
 * 业务成功码 —— 后端返回 code === SUCCESS_CODE 时视为业务成功
 */
export const SUCCESS_CODE = 0;

/**
 * HTTP 状态码
 */
export const HttpStatus = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];
