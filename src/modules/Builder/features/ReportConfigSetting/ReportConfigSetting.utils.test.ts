// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  getActivitiesOptions,
  getActivityItemsOptions,
  verifyReportServer,
  setPasswordReportServer,
  setSubjectData,
} from './ReportConfigSetting.utils';

const setValue = vi.fn();
const getParams = (newParams = {}) => ({
  setValue,
  appletName: 'Test Applet',
  activityName: 'Test Activity',
  flowName: null,
  flowActivityName: null,
  respondentId: 'resp123',
  hasActivityItemValue: false,
  hasFlowItemValue: false,
  itemName: null,
  ...newParams,
});

describe('getActivitiesOptions', () => {
  test('should return empty array if no activities or activityFlowItems', () => {
    expect(getActivitiesOptions(undefined, undefined)).toEqual([]);
    expect(getActivitiesOptions({}, undefined)).toEqual([]);
    expect(getActivitiesOptions(undefined, {})).toEqual([]);
  });

  test('should return the correct activity options', () => {
    const activities = [
      { id: 1, name: 'Activity 1' },
      { id: 2, name: 'Activity 2' },
    ];
    const activityFlow = {
      items: [{ activityKey: 'activity-1' }, { activityKey: 'activity-2' }],
    };
    const appletData = { activities };

    expect(getActivitiesOptions(activityFlow, appletData)).toEqual([]);
  });
});

describe('getActivityItemsOptions', () => {
  test('should return empty array if no activity or activity items', () => {
    expect(getActivityItemsOptions(undefined)).toEqual([]);
    expect(getActivityItemsOptions(null)).toEqual([]);
    expect(getActivityItemsOptions({})).toEqual([]);
  });

  test('should return the correct activity items options', () => {
    const activity = {
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    };

    expect(getActivityItemsOptions(activity)).toEqual([
      { labelKey: 'Item 1', value: 1 },
      { labelKey: 'Item 2', value: 2 },
    ]);
  });
});

describe('verifyReportServer', () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should call fetch with correct parameters', async () => {
    const url = 'http://example.com';
    const publicKey = 'testPublicKey';
    const token = 'testToken';

    await verifyReportServer({ url, publicKey, token });

    expect(fetch).toHaveBeenCalledWith('http://example.com/verify', {
      method: 'PUT',
      headers: {
        map: {
          'content-type': 'application/json',
          token: 'testToken',
        },
      },
      body: JSON.stringify({ publicKey }),
    });
  });
});

describe('setPasswordReportServer', () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = vi.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should call fetch with correct parameters', async () => {
    const url = 'http://example.com';
    const appletId = 'applet123';
    const ownerId = 'owner123';
    const password = 'newPassword';
    const token = 'testToken';

    await setPasswordReportServer({ url, appletId, ownerId, password, token });

    expect(fetch).toHaveBeenCalledWith('http://example.com/set-password', {
      method: 'POST',
      headers: {
        map: {
          'content-type': 'application/json',
          token: 'testToken',
        },
      },
      body: JSON.stringify({ appletId, workspaceId: ownerId, password }),
    });
  });
});

describe('setSubjectData', () => {
  test('should set the correct subject value', () => {
    setSubjectData(getParams());
    expect(setValue).toHaveBeenCalledWith(
      'subject',
      'REPORT by [Respondent ID]: Test Applet / Test Activity',
    );
  });

  test('should include item name in subject if hasActivityItemValue is true', () => {
    setSubjectData(
      getParams({
        hasActivityItemValue: true,
        itemName: 'Test Item',
      }),
    );
    expect(setValue).toHaveBeenCalledWith(
      'subject',
      'REPORT by [Respondent ID]: Test Applet / Test Activity / [Test Item]',
    );
  });

  test('should include flow and item names in subject if hasFlowItemValue is true', () => {
    setSubjectData(
      getParams({
        activityName: null,
        flowName: 'Test Flow',
        flowActivityName: 'Flow Activity',
        hasFlowItemValue: true,
        itemName: 'Test Item',
      }),
    );
    expect(setValue).toHaveBeenCalledWith(
      'subject',
      'REPORT by [Respondent ID]: Test Applet / Test Flow / Flow Activity / [Test Item]',
    );
  });
});
