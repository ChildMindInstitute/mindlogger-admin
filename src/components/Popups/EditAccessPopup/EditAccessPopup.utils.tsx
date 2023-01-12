import { Svg } from 'components/Svg';
import { Roles } from 'resources';

export const getRoleIcon = (role: string) => {
  switch (role) {
    case Roles.editor:
      return <Svg id="editor" width={18} height={16} />;
    case Roles.manager:
      return <Svg id="manager-outlined" width={15} height={18} />;
    case Roles.reviewer:
      return <Svg id="reviewer" width={16} height={18} />;
    case Roles.coordinator:
      return <Svg id="coordinator" width={18} height={15} />;
    default:
      return undefined;
  }
};
