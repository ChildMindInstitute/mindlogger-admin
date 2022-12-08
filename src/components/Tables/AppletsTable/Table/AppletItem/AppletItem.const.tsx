import { t } from 'i18next';

import { Svg } from 'components/Svg';
import { FolderApplet } from 'redux/modules';

export const actions = [
  {
    icon: <Svg id="users" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('viewUsers'),
  },
  {
    icon: <Svg id="calendar" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('viewGeneralCalendar'),
  },
  {
    icon: <Svg id="widget" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('editAnApplet'),
  },
  {
    icon: <Svg id="duplicate" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('duplicateApplet'),
  },
  {
    icon: <Svg id="trash" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('deleteApplet'),
  },
  {
    icon: <Svg id="switch-account" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('transferOwnership'),
  },
  {
    icon: <Svg id="share" width={24} height={24} />,
    action: (item: FolderApplet) => item,
    toolTipTitle: t('shareWithTheLibrary'),
  },
];
