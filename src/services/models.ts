export type RequestConfig = {
  url: string;
  data?: any;
  method?: string;
  params?: any;
  headers?: any;
  withCredentials?: boolean;
  responeType?: 'json' | 'stream';
};
