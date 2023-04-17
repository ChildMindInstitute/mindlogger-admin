import { DefaultTabs as Tabs } from 'shared/components';
import { StyledBody } from 'shared/styles';

import { dashboardTabs } from './Main.const';

export const Main = () => (
  <StyledBody>
    <Tabs tabs={dashboardTabs} />
  </StyledBody>
);
