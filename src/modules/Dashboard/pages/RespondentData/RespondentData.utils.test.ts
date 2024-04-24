import { Roles } from 'shared/consts';

import { hasPermissionToViewData } from './RespondentData.utils';

describe('RespondentData.utils', () => {
  test.each([
    [[Roles.SuperAdmin], true],
    [[Roles.Owner], true],
    [[Roles.Manager], true],
    [[Roles.Coordinator], false],
    [[Roles.Editor], false],
    [[Roles.Reviewer], true],
    [[Roles.Respondent], false],
    [[], false],
    [null, false],
    [undefined, false],
  ])('should check permissions for "%s" and returns "%s"', (roles, expected) => {
    const result = hasPermissionToViewData(roles);
    expect(result).toBe(expected);
  });
});
