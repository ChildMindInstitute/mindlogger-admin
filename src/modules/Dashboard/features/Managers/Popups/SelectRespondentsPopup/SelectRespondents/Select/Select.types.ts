import { ChangeEvent } from 'react';

type Options = {
  label: string;
  value: string;
};

export type SelectProps = {
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  options: Options[];
};
