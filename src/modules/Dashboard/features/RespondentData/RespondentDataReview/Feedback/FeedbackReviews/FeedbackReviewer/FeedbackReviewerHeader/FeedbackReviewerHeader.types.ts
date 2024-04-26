export type FeedbackReviewerHeaderProps = {
  isReviewOpen: boolean;
  reviewerName: string;
  hasReview: boolean;
  submitDate: string;
  onToggleVisibilityClick?: () => void;
  hasEditAndRemove: boolean;
  onRemoveClick: () => void;
  onEditClick: () => void;
  'data-testid'?: string;
};
