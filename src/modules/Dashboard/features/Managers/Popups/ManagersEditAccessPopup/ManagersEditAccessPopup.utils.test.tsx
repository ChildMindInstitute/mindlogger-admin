import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';

import { getRoleIcon } from './ManagersEditAccessPopup.utils';

describe('getRoleIcon', () => {
  test.each`
    role                 | expectedSvg
    ${Roles.Editor}      | ${(<Svg id="editor" width={18} height={18} />)}
    ${Roles.Manager}     | ${(<Svg id="manager-outlined" width={18} height={18} />)}
    ${Roles.Reviewer}    | ${(<Svg id="reviewer" width={18} height={18} />)}
    ${Roles.Coordinator} | ${(<Svg id="coordinator" width={18} height={18} />)}
    ${'UnknownRole'}     | ${undefined}
  `('returns correct SVG for $role role', ({ role, expectedSvg }) => {
    const roleIcon = getRoleIcon(role);
    expect(roleIcon).toEqual(expectedSvg);
  });
});
