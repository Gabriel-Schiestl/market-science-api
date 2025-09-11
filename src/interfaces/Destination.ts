export interface Source {
  url: string;
  failing?: boolean;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  token?: string;
}

export type SourceGroup = Record<string, Source[]>;

export interface FetchResult {
  groupName: string;
  data: any;
  timestamp: Date;
  source: string;
}
