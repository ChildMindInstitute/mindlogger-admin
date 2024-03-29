import { Roles } from 'shared/consts';

import { isManagerOrOwner, isManagerOrOwnerOrEditor } from './checkRole';

describe('isManagerOrOwner', () => {
  test.each`
    role                 | expected | description
    ${Roles.Manager}     | ${true}  | ${'should be true for manager'}
    ${Roles.Editor}      | ${false} | ${'should be false for editor'}
    ${Roles.Coordinator} | ${false} | ${'should be false for coordinator'}
    ${Roles.Owner}       | ${true}  | ${'should be true for owner'}
    ${Roles.Respondent}  | ${false} | ${'should be false for respondent'}
    ${Roles.Reviewer}    | ${false} | ${'should be false for reviewer'}
    ${Roles.SuperAdmin}  | ${false} | ${'should be false for superadmin'}
    ${undefined}         | ${false} | ${'should be false for undefined'}
  `('$description', ({ role, expected }) => {
    expect(isManagerOrOwner(role)).toBe(expected);
  });
});

describe('isManagerOrOwnerOrEditor', () => {
  test.each`
    role                 | expected | description
    ${Roles.Manager}     | ${true}  | ${'should be true for manager'}
    ${Roles.Editor}      | ${true}  | ${'should be true for editor'}
    ${Roles.Coordinator} | ${false} | ${'should be false for coordinator'}
    ${Roles.Owner}       | ${true}  | ${'should be true for owner'}
    ${Roles.Respondent}  | ${false} | ${'should be false for respondent'}
    ${Roles.Reviewer}    | ${false} | ${'should be false for reviewer'}
    ${Roles.SuperAdmin}  | ${false} | ${'should be false for superadmin'}
    ${undefined}         | ${false} | ${'should be false for undefined'}
  `('$description', ({ role, expected }) => {
    expect(isManagerOrOwnerOrEditor(role)).toBe(expected);
  });
});
