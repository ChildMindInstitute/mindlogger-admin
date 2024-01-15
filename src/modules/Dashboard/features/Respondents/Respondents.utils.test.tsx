import { Svg } from 'shared/components';
import { mockedAppletId } from 'shared/mock';

// import { getActions } from './Respondents.utils';

const applets = [
  {
    appletId: 'fbc90304-3fc9-4a71-a85f-aa7944278107',
    appletDisplayName: 'Applet 1',
    accessId: '8ee2c3ba-513a-4d1e-913d-fb69f0333ea4',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
  },
  {
    appletId: 'b7db8ff7-6d0b-40fd-8dfc-93f96e7ad788',
    appletDisplayName: 'Applet 2',
    accessId: '115cd54d-17f0-43f4-8469-9f1802e2da5b',
    respondentNickname: 'Jane Doe',
    respondentSecretId: 'janedoe',
    hasIndividualSchedule: false,
  },
];

const filteredApplets = {
  scheduling: applets,
  editable: applets,
  viewable: applets,
};

describe('getActions function', () => {
  // test('should return the correct actions for a respondent with scheduling and viewable applets', () => {
  //   const actions = getActions(
  //     {
  //       scheduleSetupAction: jest.fn(),
  //       viewDataAction: jest.fn(),
  //       removeAccessAction: jest.fn(),
  //       userDataExportAction: jest.fn(),
  //       editRespondent: jest.fn(),
  //     },
  //     filteredApplets,
  //     false,
  //     mockedAppletId,
  //   );
  //
  //   expect(actions).toEqual([
  //     {
  //       icon: <Svg id="user-calendar" width={20} height={21} />,
  //       action: expect.any(Function),
  //       tooltipTitle: 'View Individual Calendar',
  //       isDisplayed: true,
  //       'data-testid': 'dashboard-respondents-view-calendar',
  //     },
  //     {
  //       icon: <Svg id="data" width={22} height={22} />,
  //       action: expect.any(Function),
  //       tooltipTitle: 'View Data',
  //       isDisplayed: true,
  //       'data-testid': 'dashboard-respondents-view-data',
  //     },
  //     {
  //       icon: <Svg id="export" width={18} height={20} />,
  //       action: expect.any(Function),
  //       tooltipTitle: 'Export Data',
  //       isDisplayed: true,
  //       'data-testid': 'dashboard-respondents-export-data',
  //     },
  //     {
  //       icon: <Svg id="edit-user" width={21} height={19} />,
  //       action: expect.any(Function),
  //       tooltipTitle: 'Edit Respondent',
  //       isDisplayed: true,
  //       'data-testid': 'dashboard-respondents-edit',
  //     },
  //     {
  //       icon: <Svg id="remove-access" />,
  //       action: expect.any(Function),
  //       tooltipTitle: 'Remove Access',
  //       isDisplayed: true,
  //       'data-testid': 'dashboard-respondents-remove-access',
  //     },
  //   ]);
  //
  //   // Verify that specific actions are displayed
  //   expect(actions[0].isDisplayed).toBe(true);
  //   expect(actions[1].isDisplayed).toBe(true);
  //   expect(actions[2].isDisplayed).toBe(true);
  //   expect(actions[3].isDisplayed).toBe(true);
  //   expect(actions[4].isDisplayed).toBe(true);
  // });
  //
  // test('should return the correct actions for an anonymous respondent', () => {
  //   const actions = getActions(
  //     {
  //       scheduleSetupAction: jest.fn(),
  //       viewDataAction: jest.fn(),
  //       removeAccessAction: jest.fn(),
  //       userDataExportAction: jest.fn(),
  //       editRespondent: jest.fn(),
  //     },
  //     filteredApplets,
  //     true,
  //     mockedAppletId,
  //   );
  //
  //   // Verify that specific actions are not displayed for an anonymous respondent
  //   expect(actions[0].isDisplayed).toBe(false);
  //   expect(actions[1].isDisplayed).toBe(true);
  //   expect(actions[2].isDisplayed).toBe(true);
  //   expect(actions[3].isDisplayed).toBe(true);
  //   expect(actions[4].isDisplayed).toBe(true);
  // });
});
