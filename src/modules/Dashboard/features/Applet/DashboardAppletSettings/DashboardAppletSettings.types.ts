import { Roles } from 'shared/consts';

export type GetSettings = {
  isPublished?: boolean;
  roles?: Roles[];
  appletId?: string;
  enableShareToLibrary?: boolean;
};
