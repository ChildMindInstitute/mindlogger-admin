export type ActivityOrFlowId =
  | {
      activityId: string;
      activityFlowId?: undefined;
    }
  | {
      activityId?: undefined;
      activityFlowId: string;
    };
