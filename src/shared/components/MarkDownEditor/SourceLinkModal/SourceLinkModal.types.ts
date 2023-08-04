export enum SourceLinkModalFormValues {
  Label = 'label',
  Address = 'address',
}

export type SourceLinkModalForm = {
  label: string;
  address: string;
};

export type SourceLinkModalProps = {
  title: string;
  error?: string;
  handleClose: () => void;
  handleSubmit: (formData: SourceLinkModalForm) => void;
};
