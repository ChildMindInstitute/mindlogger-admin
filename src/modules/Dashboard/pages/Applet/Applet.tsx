import { users } from 'redux/modules';
import { StyledBody } from 'styles/styledComponents/Body';
import { LinkedTabs, Spinner } from 'components';

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
