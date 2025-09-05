export interface Source {
  url: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  token?: string;
}

export type SourceGroup = Record<string, Source[]>;
