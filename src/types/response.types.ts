// Response status union to be tolerant to backend enum/value casing
export type ResponseStatus = "SUCCESS" | "ERROR" | "success" | "error";

// Generic response DTO (aligns with backend ResponseDto)
export type ResponseDto<T = any> = {
  message: string;
  status: ResponseStatus;
  data?: T;
  error?: {
    cause: unknown;
    name: string;
    path: string;
    statusCode: number;
  };
};

// Paginated response DTO (aligns with backend PaginationResponseDto)
export type PaginationResponseDto<T> = ResponseDto<{
  items: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
  };
}>;
