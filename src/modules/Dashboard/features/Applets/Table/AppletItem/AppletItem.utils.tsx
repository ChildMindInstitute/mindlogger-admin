import { t } from 'i18next';

import { Svg } from 'shared/components';

import { Actions, Roles } from './AppletItem.types';

export const getActions = ({
  actions: {
    removeFromFolder,
    viewUsers,
    viewCalendar,
    deleteAction,
    transferOwnership,
    duplicateAction,
    // shareAppletAction,
    editAction,
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
    action: editAction,
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
  // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
  // introduced. (Story: AUS-4.1.4.10)
  // {
  //   icon: <Svg id="share" />,
  //   action: shareAppletAction,
  //   tooltipTitle: t('shareWithTheLibrary'),
  // },
];

export const hasOwnerRole = (item: unknown & { role?: string }) =>
  !!item.role?.includes(Roles.Owner);
