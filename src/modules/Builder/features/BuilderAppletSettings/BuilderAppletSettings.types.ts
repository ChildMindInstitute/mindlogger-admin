import { Roles } from 'shared/consts';

export type GetSettings = {
  isNewApplet?: boolean;
  isPublished?: boolean;
  role?: Roles | null;
};
