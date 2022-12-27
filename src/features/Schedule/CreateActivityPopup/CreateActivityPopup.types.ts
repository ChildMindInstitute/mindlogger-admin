export type CreateActivityPopupProps = {
  open: boolean;
  onClose: () => void;
};

export type FormValues = {
  activity: string;
  availability: boolean;
  completion: boolean;
  oneTimeCompletion: boolean;
  timeout: {
    access: boolean;
    allow: boolean;
  };
};
