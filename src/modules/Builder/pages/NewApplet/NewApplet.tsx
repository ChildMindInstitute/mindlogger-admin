import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { SaveAndPublish } from 'modules/Builder/features';
import { SaveChangesPopup } from 'modules/Builder/components';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody } from 'shared/styles/styledComponents';

import { newAppletTabs, pathsWithInnerTabs } from './NewApplet.const';
import { usePrompt } from './NewApplet.hooks';

export const NewApplet = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hiddenHeader = pathsWithInnerTabs.some((path) => location.pathname.includes(path));

  const { cancelNavigation, confirmNavigation, promptVisible } = usePrompt();

  useBreadcrumbs([
    {
      icon: <Svg id="applet-outlined" width="18" height="18" />,
      label: t('newApplet'), // TODO get Applet NAme
      disabledLink: true,
    },
  ]);

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
