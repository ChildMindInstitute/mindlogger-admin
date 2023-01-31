export type SearchProps = {
  placeholder: string;
  onSearch: (value: string) => void;
  width?: string;
  height?: string;
  background?: string;
  endAdornment?: JSX.Element;
  value?: string;
};
