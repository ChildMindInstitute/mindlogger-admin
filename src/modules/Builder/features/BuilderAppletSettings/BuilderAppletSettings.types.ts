import { Roles } from 'shared/consts';

export type GetSettings = {
  isNewApplet?: boolean;
  isPublished?: boolean;
  roles?: Roles[];
  enableLorisIntegration?: boolean;
  enableShareToLibrary?: boolean;
  appletId?: string;
};
