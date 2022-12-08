import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Tabs } from 'components/Tabs';
import { Spinner } from 'components/Spinner';
import { users } from 'redux/modules';
import { StyledBody } from 'styles/styledComponents/Body';
import { appletPages } from 'utils/constants';

import { useAppletTabs } from './Applet.hooks';

export const Applet = (): JSX.Element => {
  const location = useLocation();
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();
  const isLoading =
    userMetaStatus === 'loading' ||
    userMetaStatus === 'idle' ||
    managerMetaStatus === 'loading' ||
    managerMetaStatus === 'idle';
  const [activeTab, setActiveTab] = useState<undefined | number>(undefined);
  const { respondents, managers, more, schedule } = appletPages;

  const appletTabs = useAppletTabs();

  useEffect(() => {
    const { pathname } = location;
    if (pathname.includes(respondents)) {
      setActiveTab(0);
    } else if (pathname.includes(managers)) {
      setActiveTab(1);
    } else if (location.pathname.includes(schedule)) {
      setActiveTab(2);
    } else if (location.pathname.includes(more)) {
      setActiveTab(3);
    }
  }, [location]);

  return (
    <StyledBody>
      {isLoading ? <Spinner /> : <Tabs tabs={appletTabs} activeTab={activeTab} />}
    </StyledBody>
  );
};
