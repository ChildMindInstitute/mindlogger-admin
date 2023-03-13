import { SelectChangeEvent } from '@mui/material';

export type SelectProps = {
  value: string;
  changeValue: (event: SelectChangeEvent) => void;
  options: string[];
};
