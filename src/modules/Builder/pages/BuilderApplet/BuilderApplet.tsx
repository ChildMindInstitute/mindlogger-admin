import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { useEffect } from 'react';

import { SaveAndPublish } from 'modules/Builder/features';
import { SaveChangesPopup } from 'modules/Builder/components';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs, useCheckIfNewApplet } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';
import { applet } from 'shared/state';

import { newAppletTabs, pathsWithInnerTabs } from './BuilderApplet.const';
import { usePrompt } from './BuilderApplet.hooks';

export const BuilderApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hiddenHeader = pathsWithInnerTabs.some((path) => location.pathname.includes(path));
  const dispatch = useAppDispatch();
  const { cancelNavigation, confirmNavigation, promptVisible } = usePrompt();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();
  const { result: appletData } = applet.useAppletData() ?? {};
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: appletLabel,
      disabledLink: true,
    },
  ]);

  useEffect(() => {
    if (!appletId || isNewApplet) return;

    const { getApplet } = applet.thunk;
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
