export type SendInvitationPopupProps = {
  open: boolean;
  onClose: (shouldReFetch: boolean) => void;
  secretUserId: string;
  subjectId: string;
  email: string | null;
};

export type SendInvitationForm = {
  email: string;
};
