import { useEffect } from 'react';

import { Tabs } from 'components/Tabs';
import { useAppDispatch } from 'redux/store';
import { breadcrumbs } from 'redux/modules';
import { useBaseBreadcrumbs } from 'hooks';
import { StyledBody } from 'styles/styledComponents/Body';

import { dashboardTabs } from './Dashboard.const';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const baseBreadcrumbs = useBaseBreadcrumbs();

  useEffect(() => {
    if (baseBreadcrumbs && baseBreadcrumbs.length > 0) {
      dispatch(breadcrumbs.actions.setBreadcrumbs(baseBreadcrumbs));
    }
  }, [baseBreadcrumbs]);

  return (
    <StyledBody>
      <Tabs tabs={dashboardTabs} />
    </StyledBody>
  );
};
