import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import { Folder } from 'modules/Dashboard/api';

export const getFolderActions = (
  folder: Folder,
  onRenameFolder: () => void,
  onDeleteFolder: () => void,
) => [
  {
    disabled: !!folder?.isRenaming,
    icon: <Svg id="edit" />,
    action: onRenameFolder,
    title: t('edit'),
    'data-testid': 'dashboard-applets-folder-rename',
  },
  {
    disabled: !!folder.foldersAppletCount,
    icon: <Svg id="trash" />,
    action: onDeleteFolder,
    title: t('delete'),
    tooltip: folder.foldersAppletCount && t('deleteFolderWarning'),
    'data-testid': 'dashboard-applets-folder-delete',
  },
];
