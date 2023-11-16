type FullName = {
  firstName: string;
  lastName: string;
};

export type FeedbackNote = {
  id: string;
  user: FullName;
  note: string;
  createdAt: string;
};
