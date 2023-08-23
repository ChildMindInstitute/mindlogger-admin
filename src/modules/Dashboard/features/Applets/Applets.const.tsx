import { t } from 'i18next';
import { NavigateFunction } from 'react-router-dom';

import { Svg } from 'shared/components';
import { HeadCell } from 'shared/types/table';
import { getBuilderAppletUrl, Mixpanel, Path } from 'shared/utils';
import { page } from 'resources';

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'displayName',
    label: t('appletName'),
    enableSort: true,
    width: '30%',
  },
  {
    id: 'updatedAt',
    label: t('lastEdit'),
    enableSort: true,
    width: '15%',
  },
  {
    id: 'actions',
    label: t('actions'),
  },
];

export const getMenuItems = (handleMenuClose: () => void, navigate: NavigateFunction) => [
  {
    icon: <Svg id="builder" />,
    title: t('new'),
    action: () => {
      handleMenuClose();
      navigate(getBuilderAppletUrl(Path.NewApplet));
      Mixpanel.track('Build Applet click');
    },
    'data-testid': 'dashboard-applets-add-applet-new',
  },
  {
    icon: <Svg id="library" />,
    title: t('fromLibrary'),
    action: () => {
      handleMenuClose();
      navigate(page.library);
      Mixpanel.track('Browse applet library click');
    },
    'data-testid': 'dashboard-applets-add-applet-from-library',
  },
];
