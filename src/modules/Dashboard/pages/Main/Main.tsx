import { useEffect } from 'react';
import { LinkedTabs } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  useBreadcrumbs();

  useEffect(() => {
    Mixpanel.trackPageView('Dashbaord');
  }, []);

  return (
    <StyledBody>
      <LinkedTabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
