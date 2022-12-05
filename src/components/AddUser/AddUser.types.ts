import { UserRoles } from 'api';

export type Invitation = {
  MRN: string;
  firstName: string;
  lastName: string;
  nickName: string;
  role: UserRoles;
  lang: string;
  created: string;
  _id: string;
};
