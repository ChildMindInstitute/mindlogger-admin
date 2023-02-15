import { t } from 'i18next';

import { Svg } from 'components';
import { FolderApplet } from 'redux/modules';

export const getActions = (
  folder: FolderApplet,
  onRenameFolder: (folder: FolderApplet) => void,
  onDeleteFolder: (folder: FolderApplet) => void,
) => [
  {
    disabled: !!folder?.isRenaming,
    icon: <Svg id="edit" />,
    action: (item: FolderApplet) => onRenameFolder(item),
    tooltipTitle: t('edit'),
  },
  {
    disabled: !!folder?.items?.length,
    icon: <Svg id="trash" />,
    action: (item: FolderApplet) => onDeleteFolder(item),
    tooltipTitle: t(folder?.items?.length ? 'deleteFolderWarning' : 'delete'),
  },
];
