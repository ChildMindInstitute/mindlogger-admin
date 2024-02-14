import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';

export const TransferOwnershipSuccessBanner = ({ children, email, ...props }: BannerProps) => (
  <Banner
    duration={7000}
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
