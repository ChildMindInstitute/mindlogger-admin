import { Banner, BannerProps } from '../Banner';
import { MFA_ENABLED_SUCCESS_BANNER_DURATION } from './MFAEnabledSuccessBanner.const';

export const MFAEnabledSuccessBanner = ({ children, ...props }: BannerProps) => (
  <Banner duration={MFA_ENABLED_SUCCESS_BANNER_DURATION} severity="success" {...props}>
    {children ?? 'Two Factor Authentication is enabled'}
  </Banner>
);
