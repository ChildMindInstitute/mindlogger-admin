import { DefaultTabs as Tabs } from 'components/Tabs';
import { useBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  useBreadcrumbs();

  return (
    <StyledBody>
      <Tabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
