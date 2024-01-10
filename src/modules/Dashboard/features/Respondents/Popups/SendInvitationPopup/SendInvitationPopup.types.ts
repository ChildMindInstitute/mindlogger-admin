export type SendInvitationPopupProps = {
  open: boolean;
  onClose: (shouldReFetch: boolean) => void;
  secretUserId: string;
  subjectId: string;
  email?: string;
};

export type SendInvitationForm = {
  email: string;
};
