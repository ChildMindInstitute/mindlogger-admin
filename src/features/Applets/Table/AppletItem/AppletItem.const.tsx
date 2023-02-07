import { t } from 'i18next';

import { Svg } from 'components/Svg';
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
    toolTipTitle: t('removeFromFolder'),
  },
  {
    icon: <Svg id="users" />,
    action: viewUsers,
    toolTipTitle: t('viewUsers'),
  },
  {
    icon: <Svg id="calendar" />,
    action: viewCalendar,
    toolTipTitle: t('viewGeneralCalendar'),
  },
  {
    icon: <Svg id="widget" />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('editAnApplet'),
  },
  {
    icon: <Svg id="duplicate" />,
    action: duplicateAction,
    toolTipTitle: t('duplicateApplet'),
  },
  {
    icon: <Svg id="trash" />,
    action: deleteAction,
    toolTipTitle: t('deleteApplet'),
  },
  {
    icon: <Svg id="switch-account" />,
    action: transferOwnership,
    toolTipTitle: t('transferOwnership'),
  },
  {
    icon: <Svg id="share" />,
    action: shareAppletAction,
    toolTipTitle: t('shareWithTheLibrary'),
  },
];
