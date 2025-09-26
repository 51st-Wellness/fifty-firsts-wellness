export type ResponseStatus = "success" | "error";
export type ResponseType<T> = {
  status: ResponseStatus;
  message: string;
  data: T;
};

export type PaginatedResponseType<T> = ResponseType<{
  // T represents the type of entity in the items array
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
