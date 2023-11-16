import { Roles } from 'shared/consts';

import { getIsAddAppletBtnVisible } from './getIsAddAppletBtnVisible';

describe('getIsAddAppletBtnVisible', () => {
  const ownerId = 'ownerId';
  const notOwnerId = 'notOwnerId';

  const workspace = {
    ownerId,
    workspaceName: 'workspaceName',
  };

  test.each`
    workspace    | rolesData                                       | user                  | expected | description
    ${workspace} | ${{ data: { [ownerId]: [Roles.Manager] } }}     | ${{ id: ownerId }}    | ${true}  | ${'should return true if user is the owner and has Manager role'}
    ${workspace} | ${{ data: { [ownerId]: [Roles.Reviewer] } }}    | ${{ id: ownerId }}    | ${true}  | ${'should return true if user is the owner and has Reviewer role'}
    ${workspace} | ${{ data: { [notOwnerId]: [Roles.Reviewer] } }} | ${{ id: notOwnerId }} | ${false} | ${'should return false if user is not the owner and has Reviewer role'}
    ${workspace} | ${{ data: { [notOwnerId]: [Roles.Manager] } }}  | ${{ id: notOwnerId }} | ${true}  | ${'should return true if user is not the owner and has Manager role'}
    ${workspace} | ${{ data: { [notOwnerId]: [Roles.Reviewer] } }} | ${{ id: notOwnerId }} | ${false} | ${'should return false if user is not the owner and has Reviewer role'}
  `('$description', ({ workspace, rolesData, user, expected }) => {
    expect(getIsAddAppletBtnVisible(workspace, rolesData, user)).toEqual(expected);
  });
});
