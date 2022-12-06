import { Svg } from 'components/Svg';
import { FolderApplet } from 'redux/modules';

export const actions = [
  {
    icon: <Svg id="users" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="calendar" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="widget" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="duplicate" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="trash" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="switch-account" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="share" width={24} height={24} />,
    action: (item: FolderApplet) => item,
  },
];
