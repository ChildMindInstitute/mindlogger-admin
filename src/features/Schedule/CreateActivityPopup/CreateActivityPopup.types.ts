export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
};

export type FormValues = {
  activity: string;
  availability: boolean;
  completion: boolean;
  oneTimeCompletion: boolean;
  date: string;
  startEndingDate: string;
  timeout: {
    access: boolean;
  };
};
