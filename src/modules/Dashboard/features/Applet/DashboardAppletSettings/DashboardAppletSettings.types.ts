import { Roles } from 'shared/consts';

export type GetSettings = {
  appletName?: string;
  isPublished?: boolean;
  roles?: Roles[];
};
