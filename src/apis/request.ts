import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// 请求拦截器 - 统一添加 token
request.interceptors.request.use((config) => {
  return config;
});

// 响应拦截器 - 统一处理返回数据
request.interceptors.response.use(
  (response) => response.data, // 直接返回 data，调用处无需再 .data
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  },
);

export default request;
