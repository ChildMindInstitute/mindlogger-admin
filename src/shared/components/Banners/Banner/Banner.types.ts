import { AlertProps } from '@mui/material';

export type BannerProps = {
  /** @default 5000 */
  duration?: number | null;
  /** @default !!onClose */
  hasCloseButton?: boolean;
  onClose?: () => void;
} & Pick<AlertProps, 'severity' | 'color' | 'children' | 'iconMapping'> &
  Record<string, unknown>; // Custom banner props
