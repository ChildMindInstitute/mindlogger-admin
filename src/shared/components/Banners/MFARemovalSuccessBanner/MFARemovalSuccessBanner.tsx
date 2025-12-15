import { Banner, BannerProps } from '../Banner';
import { MFA_REMOVAL_SUCCESS_BANNER_DURATION } from './MFARemovalSuccessBanner.const';

export const MFARemovalSuccessBanner = ({ children, ...props }: BannerProps) => (
  <Banner duration={MFA_REMOVAL_SUCCESS_BANNER_DURATION} severity="success" {...props}>
    {children ?? 'Two-factor authentication has been successfully removed.'}
  </Banner>
);
