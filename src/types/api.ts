interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
export interface Params {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  meta?: Meta;

}

export interface ApiError {
  status: "error";
  message: string;
  code: number;
  errors?: Array<{
    path: string;
    message: string;
  }>; 
}


export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "BAD_REQUEST"
  | "UNKNOWN_ERROR";
