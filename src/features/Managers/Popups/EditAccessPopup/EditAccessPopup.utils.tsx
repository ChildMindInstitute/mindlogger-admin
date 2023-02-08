import { Svg } from 'components/Svg';
import { Roles } from 'consts';

export const getRoleIcon = (role: string) => {
  switch (role) {
    case Roles.Editor:
      return <Svg id="editor" width={18} height={18} />;
    case Roles.Manager:
      return <Svg id="manager-outlined" width={18} height={18} />;
    case Roles.Reviewer:
      return <Svg id="reviewer" width={18} height={18} />;
    case Roles.Coordinator:
      return <Svg id="coordinator" width={18} height={18} />;
    default:
      return undefined;
  }
};
