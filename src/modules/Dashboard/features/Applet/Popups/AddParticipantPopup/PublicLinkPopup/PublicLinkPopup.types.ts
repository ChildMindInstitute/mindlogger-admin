import { ModalProps } from 'shared/components';

export interface PublicLinkPopupProps extends Omit<ModalProps, 'title' | 'children' | 'onClose'> {
  appletId?: string | null;
  hasPublicLink?: boolean;
  onClose?: (shouldRefetch?: boolean) => void;
}
