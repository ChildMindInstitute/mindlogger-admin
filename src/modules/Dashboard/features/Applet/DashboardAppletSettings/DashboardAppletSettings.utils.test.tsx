import { Roles } from 'shared/consts';

import { getSettings } from './DashboardAppletSettings.utils';

describe('getSettings', () => {
  const roles = [Roles.Owner, Roles.Manager];

  test('should return right section', () => {
    const sections = ['usersAndData', 'appletContent', 'sharing'];
    expect(getSettings({ isPublished: true, roles }).map((section) => section.label)).toStrictEqual(
      sections,
    );
  });

  describe('should return right items for section ', () => {
    const usersAndDataItems = ['exportData', 'dataRetention'];
    const appletContentItems = [
      'editApplet',
      'versionHistory',
      'transferOwnership',
      'duplicateApplet',
      'deleteApplet',
    ];
    const sharingItemsForPublished = ['concealApplet'];
    const sharingItems = ['publishApplet'];

    test.each`
      isPublished | sectionLabel       | items                       | description
      ${true}     | ${'usersAndData'}  | ${usersAndDataItems}        | ${'usersAndData'}
      ${true}     | ${'appletContent'} | ${appletContentItems}       | ${'appletContent'}
      ${true}     | ${'sharing'}       | ${sharingItemsForPublished} | ${'sharing with isPublished true'}
      ${false}    | ${'sharing'}       | ${sharingItems}             | ${'sharing with isPublished false'}
    `('$description', ({ isPublished, sectionLabel, items }) => {
      expect(
        getSettings({ isPublished, roles })
          .find((section) => section.label === sectionLabel)
          ?.items.map((item) => item.label),
      ).toStrictEqual(items);
    });
  });

  describe('should return right isVisible for section ', () => {
    test.each`
      isVisible | sectionLabel      | roles                  | description
      ${true}   | ${'usersAndData'} | ${[Roles.Manager]}     | ${'usersAndData for Manager'}
      ${true}   | ${'usersAndData'} | ${[Roles.Owner]}       | ${'usersAndData for Owner'}
      ${false}  | ${'usersAndData'} | ${[Roles.Editor]}      | ${'usersAndData for Editor'}
      ${false}  | ${'usersAndData'} | ${[Roles.Coordinator]} | ${'usersAndData for Coordinator'}
      ${false}  | ${'sharing'}      | ${[Roles.Manager]}     | ${'sharing for Manager'}
      ${true}   | ${'sharing'}      | ${Roles.SuperAdmin}    | ${'sharing for SuperAdmin'}
    `('$description', ({ isVisible, sectionLabel, roles }) => {
      expect(
        getSettings({ isPublished: true, roles }).find((section) => section.label === sectionLabel)
          ?.isVisible,
      ).toBe(isVisible);
    });
  });
});
