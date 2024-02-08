import { t } from 'i18next';
import { NavigateFunction } from 'react-router-dom';

import { page } from 'resources';
import { Svg } from 'shared/components/Svg';
import { HeadCell } from 'shared/types/table';
import { getBuilderAppletUrl, Mixpanel, Path } from 'shared/utils';

export enum AppletsColumnsWidth {
  AppletName = '40rem',
  LastEdit = '20rem',
  Folder = '60rem',
}

export const getHeadCells = (): HeadCell[] => [
  {
    id: 'displayName',
    label: t('appletName'),
    enableSort: true,
    width: AppletsColumnsWidth.AppletName,
  },
  {
    id: 'updatedAt',
    label: t('lastEdit'),
    enableSort: true,
    width: AppletsColumnsWidth.LastEdit,
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
