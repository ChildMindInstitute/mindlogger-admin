import { Tabs } from 'components/Tabs';
import { UiType } from 'components/Tabs/Tabs.types';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Dashboard.const';

export const Dashboard = () => {
  useBreadcrumbs();

  return (
    <StyledBody>
      <Tabs uiType={UiType.secondary} tabs={dashboardTabs} />
    </StyledBody>
  );
};
