import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { useEffect } from 'react';

import { SaveAndPublish } from 'modules/Builder/features';
import { SaveChangesPopup } from 'modules/Builder/components';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applets } from 'modules/Dashboard/state';
import { isNewApplet } from 'shared/utils';

import { newAppletTabs, pathsWithInnerTabs } from './BuilderApplet.const';
import { usePrompt } from './BuilderApplet.hooks';

export const BuilderApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hiddenHeader = pathsWithInnerTabs.some((path) => location.pathname.includes(path));
  const dispatch = useAppDispatch();
  const { cancelNavigation, confirmNavigation, promptVisible } = usePrompt();
  const { appletId } = useParams();
  const { result: appletData } = applets.useAppletData() ?? {};
  const appletLabel = (isNewApplet(appletId) ? t('newApplet') : appletData?.displayName) ?? '';

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: appletLabel,
      disabledLink: true,
    },
  ]);

  useEffect(() => {
    if (!appletId || isNewApplet(appletId)) return;

    const { getApplet } = applets.thunk;
    dispatch(getApplet({ appletId }));
  }, [appletId]);

  return (
    <>
      <StyledBody sx={{ position: 'relative' }}>
        <LinkedTabs hiddenHeader={hiddenHeader} tabs={newAppletTabs} />
        <SaveAndPublish />
      </StyledBody>
      <SaveChangesPopup
        isPopupVisible={promptVisible}
        handleClose={cancelNavigation}
        handleSubmit={confirmNavigation}
      />
    </>
  );
};
