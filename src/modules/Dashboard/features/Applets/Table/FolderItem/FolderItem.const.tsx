import { t } from 'i18next';

import { Svg } from 'shared/components';
import { Folder } from 'api';

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
  },
  {
    disabled: !!folder.foldersAppletCount,
    icon: <Svg id="trash" />,
    action: (item: Folder) => onDeleteFolder(item),
    tooltipTitle: t(folder.foldersAppletCount ? 'deleteFolderWarning' : 'delete'),
  },
];
