import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';

export const getPreloadedState = (role = Roles.Manager, doesAppletExist = true) => ({
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [role],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      ...(doesAppletExist ? { data: { result: mockedApplet } } : {}),
    },
  },
});
