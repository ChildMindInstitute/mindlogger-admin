import { StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Spinner } from 'shared/components';
import { users } from 'modules/Dashboard/state';

import { useAppletTabs } from './Applet.hooks';

export const Applet = () => {
  const userMetaStatus = users.useUserMetaStatus();
  const managerMetaStatus = users.useManagerMetaStatus();
  const isLoading =
    userMetaStatus === 'loading' ||
    userMetaStatus === 'idle' ||
    managerMetaStatus === 'loading' ||
    managerMetaStatus === 'idle';
  const appletTabs = useAppletTabs();

  return <StyledBody>{isLoading ? <Spinner /> : <LinkedTabs tabs={appletTabs} />}</StyledBody>;
};
