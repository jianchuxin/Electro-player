import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  timeout: 5000,
});

// axios请求拦截器
request.interceptors.request.use(
  (config) => {
    return config;
  },
  (e) => {
    return Promise.reject(e);
  }
);

// axios响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (e) => {
    return Promise.reject(e);
  }
);

export default request;
