import { Tabs } from 'components/Tabs';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Dashboard.const';

export const Dashboard = () => {
  useBreadcrumbs();

  return (
    <StyledBody>
      <Tabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
