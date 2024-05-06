import { Location } from 'react-router-dom';

import { SingleApplet } from 'shared/state/Applet';
import { Workspace } from 'shared/state/Workspaces';

export const enum LocationStateKeys {
  ShouldNavigateWithoutPrompt = 'shouldNavigateWithoutPrompt',
  IsFromLibrary = 'isFromLibrary',
  IsPasswordReset = 'isPasswordReset',
  From = 'from',
  Workspace = 'workspace',
  Data = 'data',
}

export type LocationState = Partial<{
  [LocationStateKeys.ShouldNavigateWithoutPrompt]: boolean;
  [LocationStateKeys.IsFromLibrary]: boolean;
  [LocationStateKeys.IsPasswordReset]: boolean;
  [LocationStateKeys.From]: Location;
  [LocationStateKeys.Workspace]: Workspace;
  [LocationStateKeys.Data]: SingleApplet;
}>;
