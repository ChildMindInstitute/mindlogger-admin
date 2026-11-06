import { useEffect } from 'react';

import { LinkedTabs } from 'shared/components/Tabs/LinkedTabs';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils/mixpanel';
import { EHRBanners } from 'shared/components/Banners/EHRBanners';
import { MsaReminderBanner } from 'modules/Auth/features/Msa';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Dashbaord');
  }, []);

  return (
    <StyledBody>
      <EHRBanners />
      <LinkedTabs tabs={dashboardTabs} belowTabs={<MsaReminderBanner />} />
    </StyledBody>
  );
};
