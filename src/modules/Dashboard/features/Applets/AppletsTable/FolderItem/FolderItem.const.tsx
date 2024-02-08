import { t } from 'i18next';

import { Folder } from 'api';
import { Svg } from 'shared/components/Svg';

export const getActions = (
  folder: Folder,
  onRenameFolder: (folder: Folder) => void,
  onDeleteFolder: (folder: Folder) => void,
) => [
  {
    disabled: !!folder?.isRenaming,
    icon: <Svg id="edit" />,
    action: (item: Folder) => onRenameFolder(item),
    tooltipTitle: t('edit'),
    'data-testid': 'dashboard-applets-folder-rename',
  },
  {
    disabled: !!folder.foldersAppletCount,
    icon: <Svg id="trash" />,
    action: (item: Folder) => onDeleteFolder(item),
    tooltipTitle: t(folder.foldersAppletCount ? 'deleteFolderWarning' : 'delete'),
    'data-testid': 'dashboard-applets-folder-delete',
  },
];
