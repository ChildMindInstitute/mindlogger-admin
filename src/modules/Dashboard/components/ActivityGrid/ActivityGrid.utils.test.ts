import { getActivityActions } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.utils';
import {
  ActionsObject,
  ActivityActionProps,
} from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.types';
import { FeatureFlags } from 'shared/types/featureFlags';
import { mockedActivityId, mockedAppletId } from 'shared/mock';
import { Roles } from 'shared/consts';
import { MenuItem } from 'shared/components';

describe('getActivityActions', () => {
  const dataTestId = 'test';

  const actions: ActionsObject = {
    editActivity: jest.fn(),
    exportData: jest.fn(),
    assignActivity: jest.fn(),
    takeNow: jest.fn(),
  } as const;

  type Action = keyof ActionsObject;

  const menuItemTestIds: Record<Action, string> = {
    editActivity: `${dataTestId}-activity-edit`,
    exportData: `${dataTestId}-activity-export`,
    assignActivity: `${dataTestId}-activity-assign`,
    takeNow: `${dataTestId}-activity-take-now`,
  } as const;

  const featureFlags: FeatureFlags = {
    enableMultiInformant: true,
    enableMultiInformantTakeNow: true,
  };

  const expectAllMenuItemsAreReturned = (menuItems: MenuItem<ActivityActionProps>[]) => {
    expect(menuItems).toHaveLength(5);

    const [editActivity, exportData, _divider, assignActivity, takeNow] = menuItems;

    expect(editActivity).toBeDefined();
    expect(editActivity.action).toBe(actions.editActivity);
    expect(exportData).toBeDefined();
    expect(exportData.action).toBe(actions.exportData);
    expect(assignActivity).toBeDefined();
    expect(assignActivity.action).toBe(actions.assignActivity);
    expect(takeNow).toBeDefined();
    expect(takeNow.action).toBe(actions.takeNow);
  };

  const getMenuItem = (menuItems: MenuItem<ActivityActionProps>[], action: Action) => {
    switch (action) {
      case 'editActivity':
        return menuItems[0];
      case 'exportData':
        return menuItems[1];
      case 'assignActivity':
        return menuItems[3];
      case 'takeNow':
        return menuItems[4];
      default:
        throw new Error('Invalid dataTestId');
    }
  };

  const expectMenuItemIsDisplayed = (
    menuItems: MenuItem<ActivityActionProps>[],
    action: Action,
    isDisplayed: boolean,
  ) => {
    const menuItem = getMenuItem(menuItems, action);
    expect(menuItem['data-testid']).toBe(menuItemTestIds[action]);
    expect(menuItem.isDisplayed).toBe(isDisplayed);
  };

  test('Correct menu items are displayed when no roles are provided', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is a manager', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Manager],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is a coordinator', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Coordinator],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is an editor', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Editor],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is a reviewer', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Reviewer],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is a respondent', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Respondent],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is an owner', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Owner],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is a super admin', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.SuperAdmin],
      featureFlags,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Take Now menu item is not displayed when feature flag is disabled', () => {
    const menuItems = getActivityActions({
      actions,
      dataTestId,
      appletId: mockedAppletId,
      activityId: mockedActivityId,
      roles: [Roles.Manager],
      featureFlags: {
        ...featureFlags,
        enableMultiInformantTakeNow: false,
      },
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });
});
