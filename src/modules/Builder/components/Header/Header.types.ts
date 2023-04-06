export type HeaderProps = {
  title: string;
  buttons?: { label: string; icon: JSX.Element; handleClick?: () => void }[];
};
