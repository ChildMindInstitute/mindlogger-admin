export type FeedbackReviewerHeaderProps = {
  isReviewOpen: boolean;
  reviewerName: string;
  hasReview: boolean;
  createdAt: string;
  onToggleVisibilityClick?: () => void;
  onRemoveClick: (() => void) | null;
  'data-testid'?: string;
};
