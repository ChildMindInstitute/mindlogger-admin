import { Roles } from 'shared/consts';

import { getSettings } from './BuilderAppletSettings.utils';

const onReportConfigSubmitMock = jest.fn();

describe('getSettings', () => {
  const roles = [Roles.Owner, Roles.Manager];

  test('should return right section', () => {
    const sections = ['usersAndData', 'appletContent', 'reports', 'sharing'];
    expect(
      getSettings({
        isNewApplet: false,
        isPublished: true,
        roles,
        onReportConfigSubmit: onReportConfigSubmitMock,
      }).map((section) => section.label),
    ).toStrictEqual(sections);
  });

  describe('should return right items for section ', () => {
    const usersAndDataItems = ['exportData', 'dataRetention', 'liveResponseStreaming'];
    const appletContentItems = ['versionHistory', 'transferOwnership', 'deleteApplet'];
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
        getSettings({
          isNewApplet: false,
          isPublished,
          roles,
          onReportConfigSubmit: onReportConfigSubmitMock,
        })
          .find((section) => section.label === sectionLabel)
          ?.items.map((item) => item.label),
      ).toStrictEqual(items);
    });
  });

  describe('should return right isVisible for sharing section ', () => {
    test.each`
      isVisible | roles               | description
      ${false}  | ${[Roles.Manager]}  | ${'sharing for Manager'}
      ${true}   | ${Roles.SuperAdmin} | ${'sharing for SuperAdmin'}
    `('$description', ({ isVisible, roles }) => {
      expect(
        getSettings({
          isNewApplet: false,
          isPublished: true,
          roles,
          onReportConfigSubmit: onReportConfigSubmitMock,
        }).find((section) => section.label === 'sharing')?.isVisible,
      ).toBe(isVisible);
    });
  });
});
