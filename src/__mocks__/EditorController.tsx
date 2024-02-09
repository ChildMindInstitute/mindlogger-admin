import { Input } from '@mui/material';
import { EditorProps } from 'md-editor-rt';

export const StyledMdEditor = ({ modelValue, onChange, sanitize }: EditorProps) => (
  <Input value={sanitize?.(modelValue) ?? modelValue} onChange={(e) => onChange?.(e.target.value)} multiline />
);
