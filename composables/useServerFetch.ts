import {defu} from "defu";
import type {UseFetchOptions} from "nuxt/app";

type UseFetchOptionsMixin<T> = UseFetchOptions<T> & {
  requiredAuth?: boolean;
  accessToken?: string;
};

/**
 * 使用场景：服务端渲染时获取远程数据
 * useFetch 的业务封装工具函数.
 * features:
 * 1. 自动添加 apiBase
 * 2. 根据需要自动为 API 添加 Token 请求头
 * 3. 处理 401 响应
 * @see https://nuxt.com/docs/api/composables/use-fetch
 * @param path API 请求端点
 * @param opts UseFetchOptionsMixin 请求参数
 */
export async function useServerFetch<T>(
  path: string | (() => string),
  opts: UseFetchOptionsMixin<T> = {
    requiredAuth: false,
  }
) {
  const config = useRuntimeConfig();
  const cookieHeaders = useRequestHeaders(["cookie", "Accept-Language"]);

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiBase as string,
    async onRequest({ options}) {
      // Set the request headers
      const headers = options.headers || {};
      options.headers = {
        ...headers,
        ...cookieHeaders,
      };
    }
  };

  const params = defu(opts, defaults);
  return useFetch(path, params);
}

