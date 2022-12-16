import { t } from 'i18next';

import { Svg } from 'components/Svg';
import { FolderApplet } from 'redux/modules';

export const getActions = (
  folder: FolderApplet,
  onRenameFolder: (folder: FolderApplet) => void,
  onDeleteFolder: (folder: FolderApplet) => void,
) => [
  {
    disabled: !!folder?.isRenaming,
    icon: <Svg id="edit" width={24} height={24} />,
    action: (item: FolderApplet) => onRenameFolder(item),
    toolTipTitle: t('edit'),
  },
  {
    disabled: !!folder?.items?.length,
    icon: <Svg id="trash" width={24} height={24} />,
    action: (item: FolderApplet) => onDeleteFolder(item),
    toolTipTitle: t(folder?.items?.length ? 'deleteFolderWarning' : 'delete'),
  },
];
