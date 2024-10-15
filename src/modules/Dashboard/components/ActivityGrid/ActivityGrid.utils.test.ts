import { getActivityActions } from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.utils';
import {
  ActionsObject,
  ActivityActionProps,
  ActivityActions,
} from 'modules/Dashboard/components/ActivityGrid/ActivityGrid.types';
import { mockedAppletFormData, mockedAppletId } from 'shared/mock';
import { Roles } from 'shared/consts';
import { MenuItem } from 'shared/components';
import { Activity } from 'redux/modules';

describe('getActivityActions', () => {
  const dataTestId = 'test';

  const actions: ActionsObject = {
    editActivity: jest.fn(),
    exportData: jest.fn(),
    assignActivity: jest.fn(),
    unassignActivity: jest.fn(),
    takeNow: jest.fn(),
  } as const;

  type Action = keyof ActionsObject;

  const menuItemTestIds: Record<Action, string> = {
    editActivity: `${dataTestId}-activity-edit`,
    exportData: `${dataTestId}-activity-export`,
    assignActivity: `${dataTestId}-activity-assign`,
    unassignActivity: `${dataTestId}-activity-unassign`,
    takeNow: `${dataTestId}-activity-take-now`,
  } as const;

  const expectAllMenuItemsAreReturned = (menuItems: MenuItem<ActivityActionProps>[]) => {
    expect(menuItems).toHaveLength(6);

    const [editActivity, exportData, assignActivity, unassignActivity, _divider, takeNow] =
      menuItems;

    expect(editActivity).toBeDefined();
    expect(editActivity.action).toBe(actions.editActivity);
    expect(exportData).toBeDefined();
    expect(exportData.action).toBe(actions.exportData);
    expect(assignActivity).toBeDefined();
    expect(assignActivity.action).toBe(actions.assignActivity);
    expect(unassignActivity).toBeDefined();
    expect(unassignActivity.action).toBe(actions.unassignActivity);
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
        return menuItems[2];
      case 'unassignActivity':
        return menuItems[3];
      case 'takeNow':
        return menuItems[5];
      default:
        throw new Error('Invalid dataTestId');
    }
  };

  const expectMenuItemIsDisplayed = (
    menuItems: MenuItem<ActivityActionProps>[],
    action: Action,
    isDisplayed: boolean,
    disabled?: boolean,
  ) => {
    const menuItem = getMenuItem(menuItems, action);
    expect(menuItem['data-testid']).toBe(menuItemTestIds[action]);
    expect(menuItem.isDisplayed).toBe(isDisplayed);
    if (disabled !== undefined) {
      expect(menuItem.disabled).toBe(disabled);
    }
  };

  const activity = mockedAppletFormData.activities[0] as unknown as Activity;
  const unassignedActivity = { ...activity, autoAssign: false };

  const defaultArgs: ActivityActions = {
    actions,
    dataTestId,
    appletId: mockedAppletId,
    activity,
    roles: [],
    featureFlags: {
      enableActivityAssign: true,
      enableActivityFilterSort: true,
    },
    hasParticipants: true,
  };

  test('Correct menu items are displayed when no roles are provided', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', false);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed for assigned activity when user is a manager', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Manager],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', true, true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is a coordinator', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Coordinator],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', false);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', true, true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is an editor', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Editor],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', false);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is a reviewer', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Reviewer],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is a respondent', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Respondent],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'exportData', false);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', false);
  });

  test('Correct menu items are displayed when user is an owner', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Owner],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', true, true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is a super admin', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.SuperAdmin],
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', true, true);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Correct menu items are displayed when user is an owner and activity is unassigned', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Owner],
      activity: unassignedActivity,
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });

  test('Assign Activity menu item is not displayed when feature flag is disabled', () => {
    const menuItems = getActivityActions({
      ...defaultArgs,
      roles: [Roles.Manager],
      featureFlags: {
        ...defaultArgs.featureFlags,
        enableActivityAssign: false,
      },
    });

    expectAllMenuItemsAreReturned(menuItems);
    expectMenuItemIsDisplayed(menuItems, 'editActivity', true);
    expectMenuItemIsDisplayed(menuItems, 'exportData', true);
    expectMenuItemIsDisplayed(menuItems, 'assignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'unassignActivity', false);
    expectMenuItemIsDisplayed(menuItems, 'takeNow', true);
  });
});
