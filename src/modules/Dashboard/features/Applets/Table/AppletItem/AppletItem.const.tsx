import { t } from 'i18next';

import { Svg } from 'shared/components';
import { FolderApplet } from 'redux/modules';

import { Actions } from './AppletItem.types';

export const getActions = ({
  actions: {
    removeFromFolder,
    viewUsers,
    viewCalendar,
    deleteAction,
    transferOwnership,
    duplicateAction,
    shareAppletAction,
  },
  item,
}: Actions) => [
  {
    isDisplayed: !!item.parentId,
    icon: <Svg id="remove-from-folder" />,
    action: removeFromFolder,
    tooltipTitle: t('removeFromFolder'),
  },
  {
    icon: <Svg id="users" />,
    action: viewUsers,
    tooltipTitle: t('viewUsers'),
  },
  {
    icon: <Svg id="calendar" />,
    action: viewCalendar,
    tooltipTitle: t('viewGeneralCalendar'),
  },
  {
    icon: <Svg id="widget" />,
    action: (item: FolderApplet) => item,
    tooltipTitle: t('editAnApplet'),
  },
  {
    icon: <Svg id="duplicate" />,
    action: duplicateAction,
    tooltipTitle: t('duplicateApplet'),
  },
  {
    icon: <Svg id="trash" />,
    action: deleteAction,
    tooltipTitle: t('deleteApplet'),
  },
  {
    icon: <Svg id="switch-account" />,
    action: transferOwnership,
    tooltipTitle: t('transferOwnership'),
  },
  {
    icon: <Svg id="share" />,
    action: shareAppletAction,
    tooltipTitle: t('shareWithTheLibrary'),
  },
];
