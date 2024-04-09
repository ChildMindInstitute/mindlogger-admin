import { Trans } from 'react-i18next';

import { Banner, BannerProps } from 'shared/components/Banners/Banner';

import { AccountType } from '../AddParticipantPopup.types';

export const AddParticipantSuccessBanner = ({
  accountType = AccountType.Full,
  id,
  onClose,
  ...props
}: BannerProps) => {
  const i18nKey =
    accountType === AccountType.Full ? 'addFullAccountSuccess' : 'addLimitedAccountSuccess';

  return (
    <Banner severity="success" onClose={onClose} {...props}>
      <Trans i18nKey={i18nKey}>
        Created account for
        <strong>
          <>{{ id: String(id) }}</>
        </strong>
      </Trans>
    </Banner>
  );
};
