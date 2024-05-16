import { Roles } from 'shared/consts';

import { getUrl, getRoles } from './AddUserForm.utils';

describe('getUrl', () => {
  test.each([
    [Roles.Respondent, 'respondent'],
    [Roles.Reviewer, 'reviewer'],
    ['unknownRole', 'managers'],
  ])('returns correct URL for role %s', (role, expectedUrl) => {
    expect(getUrl(role)).toBe(expectedUrl);
  });
});

describe('getRoles', () => {
  test.each([
    [
      undefined,
      [
        { labelKey: Roles.Respondent, value: Roles.Respondent },
        { labelKey: Roles.Manager, value: Roles.Manager },
        { labelKey: Roles.Coordinator, value: Roles.Coordinator },
        { labelKey: Roles.Editor, value: Roles.Editor },
        { labelKey: Roles.Reviewer, value: Roles.Reviewer },
      ],
    ],
    [
      [],
      [
        { labelKey: Roles.Respondent, value: Roles.Respondent },
        { labelKey: Roles.Manager, value: Roles.Manager },
        { labelKey: Roles.Coordinator, value: Roles.Coordinator },
        { labelKey: Roles.Editor, value: Roles.Editor },
        { labelKey: Roles.Reviewer, value: Roles.Reviewer },
      ],
    ],
    [
      [Roles.Coordinator],
      [
        { labelKey: Roles.Respondent, value: Roles.Respondent },
        { labelKey: Roles.Reviewer, value: Roles.Reviewer },
      ],
    ],
    [
      [Roles.Manager, Roles.Editor],
      [
        { labelKey: Roles.Respondent, value: Roles.Respondent },
        { labelKey: Roles.Manager, value: Roles.Manager },
        { labelKey: Roles.Coordinator, value: Roles.Coordinator },
        { labelKey: Roles.Editor, value: Roles.Editor },
        { labelKey: Roles.Reviewer, value: Roles.Reviewer },
      ],
    ],
  ])('returns correct roles array for roles %p', (input, expected) => {
    expect(getRoles(input)).toEqual(expected);
  });
});
