import { Roles } from 'shared/consts';

import { getSettings } from './DashboardAppletSettings.utils';

const appletId = 'appletId';

describe('getSettings', () => {
  const roles = [Roles.Owner, Roles.Manager];

  test('should return right section', () => {
    const sections = ['usersAndData', 'appletContent', 'sharing'];
    expect(
      getSettings({ isPublished: true, roles, appletId }).map((section) => section.label),
    ).toStrictEqual(sections);
  });

  describe('should return right items for section ', () => {
    const usersAndDataItems = ['dataRetention'];
    const appletContentItems = [
      'editApplet',
      'versionHistory',
      'transferOwnership',
      'duplicateApplet',
      'deleteApplet',
    ];
    const sharingItemsForPublished = ['shareToLibrary', 'concealApplet'];
    const sharingItems = ['shareToLibrary', 'publishApplet'];

    test.each`
      isPublished | sectionLabel       | items                       | description
      ${true}     | ${'usersAndData'}  | ${usersAndDataItems}        | ${'usersAndData'}
      ${true}     | ${'appletContent'} | ${appletContentItems}       | ${'appletContent'}
      ${true}     | ${'sharing'}       | ${sharingItemsForPublished} | ${'sharing with isPublished true'}
      ${false}    | ${'sharing'}       | ${sharingItems}             | ${'sharing with isPublished false'}
    `('$description', ({ isPublished, sectionLabel, items }) => {
      expect(
        getSettings({ isPublished, roles, appletId })
          .find((section) => section.label === sectionLabel)
          ?.items.map((item) => item.label),
      ).toStrictEqual(items);
    });
  });

  describe('should return right isVisible for section ', () => {
    test.each`
      isVisible | sectionLabel      | roles                  | enableShareToLibrary | description
      ${true}   | ${'usersAndData'} | ${[Roles.Manager]}     | ${false}             | ${'usersAndData for Manager'}
      ${true}   | ${'usersAndData'} | ${[Roles.Owner]}       | ${false}             | ${'usersAndData for Owner'}
      ${false}  | ${'usersAndData'} | ${[Roles.Editor]}      | ${false}             | ${'usersAndData for Editor'}
      ${false}  | ${'usersAndData'} | ${[Roles.Coordinator]} | ${false}             | ${'usersAndData for Coordinator'}
      ${false}  | ${'sharing'}      | ${[Roles.Manager]}     | ${false}             | ${'sharing for Manager'}
      ${true}   | ${'sharing'}      | ${[Roles.Manager]}     | ${true}              | ${'sharing with enableShareToLibrary flag and Manager role'}
      ${true}   | ${'sharing'}      | ${[Roles.Owner]}       | ${true}              | ${'sharing with enableShareToLibrary flag and Owner role'}
      ${true}   | ${'sharing'}      | ${[Roles.Editor]}      | ${true}              | ${'sharing with enableShareToLibrary flag and Editor role'}
      ${false}  | ${'sharing'}      | ${[Roles.Coordinator]} | ${true}              | ${'sharing with enableShareToLibrary flag and Coordinator role'}
      ${true}   | ${'sharing'}      | ${[Roles.SuperAdmin]}  | ${false}             | ${'sharing for SuperAdmin'}
    `('$description', ({ isVisible, sectionLabel, roles, enableShareToLibrary }) => {
      expect(
        getSettings({ isPublished: true, roles, appletId, enableShareToLibrary }).find(
          (section) => section.label === sectionLabel,
        )?.isVisible,
      ).toBe(isVisible);
    });
  });
});
