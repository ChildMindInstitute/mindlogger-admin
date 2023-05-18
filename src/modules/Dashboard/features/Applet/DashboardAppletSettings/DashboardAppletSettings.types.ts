import { Roles } from 'shared/consts';

export type GetSettings = {
  isPublished?: boolean;
  role?: Roles | null;
};
