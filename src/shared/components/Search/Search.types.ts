export type SearchProps = {
  withDebounce?: boolean;
  placeholder: string;
  width?: string;
  height?: string;
  background?: string;
  endAdornment?: JSX.Element;
  value?: string;
  onSearch?: (value: string) => void;
  'data-testid'?: string;
};
