export type UseFeedbackReviewsParams = {
  appletId: string | undefined;
  answerId: string | null;
  submitId: string | null;
  user: { id: string; firstName: string; lastName: string } | undefined;
};
