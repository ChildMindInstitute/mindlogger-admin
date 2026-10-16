import { Trans, useTranslation } from 'react-i18next';

import { auth } from 'modules/Auth/state';
import { useAppDispatch } from 'redux/store';
import { Banner } from 'shared/components/Banners/Banner';
import { getLongDate, parseDateToMidnightLocal } from 'shared/utils/dateFormat';

import { useGetMsaStatusQuery } from '../../../api/msaApiSlice';
import { StyledReviewLink } from './MsaReminderBanner.styles';

// Reminds users in the MSA grace period to accept before the deadline
export const MsaReminderBanner = () => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { data: msaStatus } = useGetMsaStatusQuery();

  if (msaStatus?.status !== 'grace' || !msaStatus.deadline) return null;

  return (
    <Banner severity="warning" duration={null} data-testid="msa-reminder-banner">
      <Trans
        t={t}
        i18nKey="msaReminderBanner"
        values={{ date: getLongDate(parseDateToMidnightLocal(msaStatus.deadline)) }}
        components={{
          strong: <strong />,
          reviewLink: (
            <StyledReviewLink
              component="button"
              underline="always"
              onClick={() => dispatch(auth.actions.showMsaPrompt())}
              data-testid="msa-reminder-banner-review"
            />
          ),
        }}
      />
    </Banner>
  );
};
