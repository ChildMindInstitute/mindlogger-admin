import { useEffect } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { LinkedTabs } from 'shared/components/Tabs/LinkedTabs';
import { StyledBody } from 'shared/styles/styledComponents';
import { Mixpanel } from 'shared/utils/mixpanel';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  const { testingFlag } = useFlags();
  console.log({ testingFlag });

  useEffect(() => {
    Mixpanel.trackPageView('Dashbaord');
  }, []);

  return (
    <StyledBody>
      <LinkedTabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
