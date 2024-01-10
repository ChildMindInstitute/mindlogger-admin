import { useEffect } from 'react';

import { LinkedTabs } from 'shared/components/Tabs/LinkedTabs';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils/mixpanel';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  useEffect(() => {
    Mixpanel.trackPageView('Dashbaord');
  }, []);

  return (
    <StyledBody>
      <LinkedTabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
