export interface ApiResponse<T> {
  data: T;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, undefined>;
}

export type ApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'UNKNOWN_ERROR';
