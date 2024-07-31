import { Roles } from 'shared/consts';

import { getSettings } from './BuilderAppletSettings.utils';

const appletId = 'appletId';

describe('getSettings', () => {
  const roles = [Roles.Owner, Roles.Manager];

  test('should return right section', () => {
    const sections = ['usersAndData', 'appletContent', 'reports', 'sharing'];
    expect(
      getSettings({
        isNewApplet: false,
        isPublished: true,
        roles,
        appletId,
      }).map((section) => section.label),
    ).toStrictEqual(sections);
  });

  describe('should return right items for section ', () => {
    const usersAndDataItems = ['dataRetention', 'liveResponseStreaming'];
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
          appletId,
        })
          .find((section) => section.label === sectionLabel)
          ?.items.map((item) => item.label),
      ).toStrictEqual(items);
    });
  });

  describe('should return isDisabled true for new applet for', () => {
    const items = getSettings({
      isNewApplet: true,
      isPublished: true,
      roles,
      appletId,
    })
      .map((setting) => setting.items)
      .flat();

    test.each`
      label                    | description
      ${'dataRetention'}       | ${'data retention'}
      ${'versionHistory'}      | ${'version history'}
      ${'transferOwnership'}   | ${'transfer ownership'}
      ${'deleteApplet'}        | ${'delete applet'}
      ${'reportConfiguration'} | ${'report configuration'}
      ${'concealApplet'}       | ${'conceal applet'}
    `('$description', ({ label }) => {
      expect(items.find((item) => item.label === label)?.disabled).toBe(true);
    });
  });

  describe('should return right isVisible for sharing section ', () => {
    test.each`
      isVisible | roles                | description
      ${false}  | ${[Roles.Manager]}   | ${'sharing for Manager'}
      ${true}   | ${Roles.SuperAdmin}  | ${'sharing for SuperAdmin'}
      ${false}  | ${Roles.Owner}       | ${'sharing for Owner'}
      ${false}  | ${Roles.Coordinator} | ${'sharing for Coordinator'}
      ${false}  | ${Roles.Editor}      | ${'sharing for Editor'}
      ${false}  | ${Roles.Respondent}  | ${'sharing for Respondent'}
      ${false}  | ${Roles.Reviewer}    | ${'sharing for Reviewer'}
    `('$description', ({ isVisible, roles }) => {
      expect(
        getSettings({
          isNewApplet: false,
          isPublished: true,
          roles,
          appletId,
        }).find((section) => section.label === 'sharing')?.isVisible,
      ).toBe(isVisible);
    });
  });
});
