import { AlertProps } from '@mui/material';

export type BannerProps = {
  /** @default 5000 */
  duration?: number | null;
  /** @default !!onClose */
  hasCloseButton?: boolean;
  onClose?: () => void;
} & Pick<AlertProps, 'severity' | 'children'> &
  Record<string, unknown>; // Custom banner props
