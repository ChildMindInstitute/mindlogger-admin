import { t } from 'i18next';

import { Svg } from 'components/Svg';
import { FolderApplet } from 'redux/modules';

import { ActionsRender } from './AppletItem.types';

export const actionsRender = ({ deleteAction, duplicateAction }: ActionsRender) => [
  {
    icon: <Svg id="users" />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('viewUsers'),
  },
  {
    icon: <Svg id="calendar" />,
    action: (item: FolderApplet) => item,
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
    action: (item: FolderApplet) => item,
    toolTipTitle: t('transferOwnership'),
  },
  {
    icon: <Svg id="share" />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('shareWithTheLibrary'),
  },
];
