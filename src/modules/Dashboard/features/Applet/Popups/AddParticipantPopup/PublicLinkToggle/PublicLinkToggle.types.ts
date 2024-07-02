import { StyledFlexSpaceBetween } from 'shared/styles';

export interface PublicLinkToggleProps extends React.ComponentProps<typeof StyledFlexSpaceBetween> {
  appletId?: null | string;
  'data-testid'?: string;
  onConfirmPublicLink?: (hasPublicLink?: boolean) => void;
}
