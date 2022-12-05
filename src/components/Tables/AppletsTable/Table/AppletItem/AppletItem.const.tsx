import { Svg } from 'components/Svg';
import { FolderApplet } from 'redux/modules';

export const actions = [
  {
    icon: <Svg id="users" width={22} height={17} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="calendar" width={20} height={22} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="widget" width={18} height={18} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="duplicate" width={18} height={20} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="trash" width={18} height={20} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="switch-account" width={22} height={17} />,
    action: (item: FolderApplet) => item,
  },
  {
    icon: <Svg id="share" width={20} height={20} />,
    action: (item: FolderApplet) => item,
  },
];
