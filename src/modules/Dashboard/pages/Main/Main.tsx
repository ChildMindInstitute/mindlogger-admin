import { LinkedTabs } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';

import { dashboardTabs } from './Main.const';

export const Main = () => {
  useBreadcrumbs();

  return (
    <StyledBody>
      <LinkedTabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
