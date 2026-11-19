import { Applet, DashboardAppletType } from 'api';
import { Roles } from 'shared/consts';

import { getCopyTargetApplets } from './CopyActivityModal.utils';

const getApplet = (id: string, role: Roles, type = DashboardAppletType.Applet) =>
  ({ id, displayName: `Applet ${id}`, image: '', role, type }) as Applet;

describe('getCopyTargetApplets', () => {
  test('keeps only editable applets other than the current one', () => {
    const applets = [
      getApplet('folder', Roles.Owner, DashboardAppletType.Folder),
      getApplet('respondent', Roles.Respondent),
      getApplet('current', Roles.Owner),
      getApplet('editor', Roles.Editor),
    ];

    expect(getCopyTargetApplets(applets, 'current')).toEqual([
      { id: 'editor', appletName: 'Applet editor', image: '' },
    ]);
  });
});
