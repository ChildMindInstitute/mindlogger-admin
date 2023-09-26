import { useEffect } from 'react';

import { LinkedTabs } from 'shared/components';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';

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
