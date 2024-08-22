import { TextFieldProps, TextFieldVariants } from '@mui/material';

import { Item, PhrasalTemplateFieldType } from 'redux/modules';

export type PhrasalTemplateFieldProps<Variant extends TextFieldVariants = TextFieldVariants> = {
  canRemove?: boolean;
  onRemove?: () => void;
  responseOptions?: Item[];
  type?: PhrasalTemplateFieldType;
} & TextFieldProps<Variant>;
