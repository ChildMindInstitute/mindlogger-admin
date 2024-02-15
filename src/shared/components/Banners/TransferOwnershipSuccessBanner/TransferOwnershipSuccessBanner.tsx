import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';
import { TRANSFER_OWNERSHIP_SUCCESS_BANNER_DURATION } from './TransferOwnershipSuccessBanner.const';

export const TransferOwnershipSuccessBanner = ({ children, email, ...props }: BannerProps) => (
  <Banner
    duration={TRANSFER_OWNERSHIP_SUCCESS_BANNER_DURATION}
    severity="success"
    data-testid="transfer-ownership-success-banner"
    {...props}
  >
    <Trans i18nKey="requestTransferOwnershipSuccess">
      <>
        Your request has been successfully sent to
        <strong>
          <>{{ email }}</>
        </strong>
        . Please wait for receiver to accept your request.
      </>
    </Trans>
  </Banner>
);
