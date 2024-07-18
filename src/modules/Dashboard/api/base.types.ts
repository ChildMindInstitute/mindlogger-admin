export type ApiSuccessResponse<Result> = {
  result: Result | null;
};

export type ApiSuccessListResponse<Result> = {
  result: Result[];
  count: number;
};

export type ApiSuccessListOrderingResponse<Result> = ApiSuccessListResponse<Result> & {
  orderingFields: string[];
};
