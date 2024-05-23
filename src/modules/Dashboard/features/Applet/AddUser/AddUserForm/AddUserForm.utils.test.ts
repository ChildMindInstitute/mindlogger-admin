import { Roles } from 'shared/consts';

import { getUrl, getRoles } from './AddUserForm.utils';

describe('AddUserForm.utils', () => {
  describe('getUrl', () => {
    test.each`
      role                | expected
      ${Roles.Respondent} | ${'respondent'}
      ${Roles.Reviewer}   | ${'reviewer'}
      ${'someOtherRole'}  | ${'managers'}
    `('role=$role, expected=$expected', async ({ role, expected }) => {
      expect(getUrl(role)).toBe(expected);
    });
  });

  describe('getRoles', () => {
    const expected1 = [
      {
        labelKey: Roles.Respondent,
        value: Roles.Respondent,
      },
      {
        labelKey: Roles.Reviewer,
        value: Roles.Reviewer,
      },
    ];
    const expected2 = [
      {
        labelKey: Roles.Respondent,
        value: Roles.Respondent,
      },
      {
        labelKey: Roles.Manager,
        value: Roles.Manager,
      },
      {
        labelKey: Roles.Coordinator,
        value: Roles.Coordinator,
      },
      {
        labelKey: Roles.Editor,
        value: Roles.Editor,
      },
      {
        labelKey: Roles.Reviewer,
        value: Roles.Reviewer,
      },
    ];
    const description1 =
      'should include Manager, Coordinator, and Editor in addition to Respondent and Reviewer when roles array is undefined';
    const description2 =
      'should include Manager, Coordinator, and Editor in addition to Respondent and Reviewer when roles array does not include Coordinator';
    const description3 =
      'should not include Manager, Coordinator, and Editor when roles array includes Coordinator';
    const description4 =
      'should include Manager, Coordinator, and Editor in addition to Respondent and Reviewer when roles array is empty';

    test.each`
      roles                                                    | expected     | description
      ${undefined}                                             | ${expected2} | ${description1}
      ${[Roles.Respondent, Roles.Reviewer]}                    | ${expected2} | ${description2}
      ${[Roles.Respondent, Roles.Reviewer, Roles.Coordinator]} | ${expected1} | ${description3}
      ${[]}                                                    | ${expected2} | ${description4}
    `('$description', async ({ roles, expected }) => {
      expect(getRoles(roles)).toEqual(expected);
    });
  });
});
