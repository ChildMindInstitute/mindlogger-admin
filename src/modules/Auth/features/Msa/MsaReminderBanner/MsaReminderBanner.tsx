import { Trans, useTranslation } from 'react-i18next';

import { Banner } from 'shared/components/Banners/Banner';
import { getLongDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import { useGetMsaStatusQuery } from '../../../api/msaApiSlice';

// Reminds users in the MSA grace period to accept before the deadline
export const MsaReminderBanner = () => {
  const { t } = useTranslation('app');
  const { data: msaStatus } = useGetMsaStatusQuery();

  if (msaStatus?.status !== 'grace' || !msaStatus.deadline) return null;

  return (
    <Banner severity="warning" duration={null} data-testid="msa-reminder-banner">
      <Trans
        t={t}
        i18nKey="msaReminderBanner"
        values={{ date: getLongDate(parseDateToMidnightLocal(msaStatus.deadline)) }}
        components={{ strong: <strong />, reviewLink: <span /> }}
      />
    </Banner>
  );
};
