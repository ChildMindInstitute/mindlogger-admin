import { Roles } from 'shared/consts';

export type WithPermissionsProps = { children: JSX.Element; forbiddenRoles?: Roles[] };
