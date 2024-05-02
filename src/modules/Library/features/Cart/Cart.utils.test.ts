// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemResponseType, PerfTaskType } from 'shared/consts';
import { LocationStateKeys } from 'shared/types';

import {
  getSearchIncludes,
  getPerformanceTaskType,
  mapResponseValues,
  getSelectedAppletData,
  navigateToBuilder,
} from './Cart.utils';

const mockUuid = '6b14a126-4031-4a5d-9aee-0062cea4cb00';
jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  v4: () => mockUuid,
}));

describe('getSearchIncludes', () => {
  test.each`
    value          | searchValue   | expectedResult
    ${'example'}   | ${'ex'}       | ${true}
    ${'example'}   | ${'EX'}       | ${true}
    ${'another'}   | ${'other'}    | ${true}
    ${'searching'} | ${'search'}   | ${true}
    ${'example'}   | ${'notfound'} | ${false}
    ${''}          | ${'search'}   | ${false}
  `(
    'returns $expectedResult for value "$value" and searchValue "$searchValue"',
    ({ value, searchValue, expectedResult }) => {
      const result = getSearchIncludes(value, searchValue);
      expect(result).toBe(expectedResult);
    },
  );
});

describe('getPerformanceTaskType', () => {
  test.each`
    responseType                         | expectedPerformanceTaskType
    ${ItemResponseType.Flanker}          | ${PerfTaskType.Flanker}
    ${ItemResponseType.TouchPractice}    | ${PerfTaskType.Touch}
    ${ItemResponseType.TouchTest}        | ${PerfTaskType.Touch}
    ${ItemResponseType.ABTrails}         | ${PerfTaskType.ABTrailsMobile}
    ${ItemResponseType.StabilityTracker} | ${PerfTaskType.Gyroscope}
  `(
    'maps $responseType to $expectedPerformanceTaskType',
    ({ responseType, expectedPerformanceTaskType }) => {
      const result = getPerformanceTaskType(responseType);
      expect(result).toBe(expectedPerformanceTaskType);
    },
  );
});

describe('mapResponseValues', () => {
  test('maps options without dataMatrix', () => {
    const responseValues = {
      options: [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ],
    };

    const result = mapResponseValues(responseValues);
    expect(result).toEqual(responseValues);
  });

  test('maps options with dataMatrix', () => {
    const responseValues = {
      dataMatrix: [
        {
          rowId: 'row1',
          options: [
            { optionId: '1', score: 10, alert: { alert: 'High' } },
            { optionId: '2', score: 5, alert: { alert: 'Low' } },
          ],
        },
      ],
      options: [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ],
    };

    const result = mapResponseValues(responseValues);
    expect(result).toEqual(responseValues);
  });

  test('maps options with dataMatrix and generates ids if missing', () => {
    const responseValues = {
      dataMatrix: [
        {
          rowId: 'row1',
          options: [
            { optionId: '1', score: 10, alert: { alert: 'High' } },
            { optionId: '2', score: 5, alert: { alert: 'Low' } },
          ],
        },
      ],
      options: [{ text: 'Option 1' }, { text: 'Option 2' }],
    };

    const result = mapResponseValues(responseValues);
    expect(result).toEqual({
      dataMatrix: [
        {
          rowId: 'row1',
          options: [
            { optionId: '1', score: 10, alert: { alert: 'High' } },
            { optionId: '2', score: 5, alert: { alert: 'Low' } },
          ],
        },
      ],
      options: [
        { text: 'Option 1', id: '1' },
        { text: 'Option 2', id: '2' },
      ],
    });
  });
});

describe('getSelectedAppletData', () => {
  const applet = {
    activities: [
      {
        key: 'activity-key-1',
        name: 'Activity 1',
        items: [
          {
            name: 'Item1',
            responseType: 'singleSelect',
            responseValues: {
              options: [
                { id: 'ss-1', text: 'ss option 1', value: 0 },
                { id: 'ss-2', text: 'ss option 2', value: 1 },
              ],
            },
          },
          {
            name: 'Item2',
            responseType: 'multiSelect',
            responseValues: {
              options: [
                { id: 'ms-1', text: 'ms option 1', value: 0 },
                { id: 'ms-2', text: 'ms option 2', value: 1 },
              ],
            },
            conditionalLogic: {
              match: 'all',
              conditions: [
                {
                  itemName: 'Item1',
                  type: 'EQUAL_TO_OPTION',
                  payload: {
                    optionValue: '0',
                  },
                },
              ],
            },
          },
        ],
      },
      {
        key: 'activity-key-2',
        name: 'A/B Trails iPad',
        isPerformanceTask: true,
        performanceTaskType: 'ABTrails',
        items: [
          {
            responseType: 'ABTrails',
            responseValues: null,
            config: {},
            name: 'ABTrails_tablet_1',
            conditionalLogic: null,
          },
          {
            responseType: 'ABTrails',
            responseValues: null,
            config: {},
            name: 'ABTrails_tablet_2',
            conditionalLogic: null,
          },
        ],
      },
    ],
    activityFlows: [
      {
        key: 'flow-key-1',
        items: [
          { activityKey: 'activity-key-1', key: 'flow-item-1' },
          { activityKey: 'activity-key-2', key: 'flow-item-2' },
        ],
      },
    ],
  };

  const selectedItems = [
    { activityKey: 'activity-key-1', itemNamePlusActivityName: 'Item2-Activity 1' },
    {
      activityKey: 'activity-key-2',
      itemNamePlusActivityName: 'ABTrails_tablet_1-A/B Trails iPad',
    },
    {
      activityKey: 'activity-key-2',
      itemNamePlusActivityName: 'ABTrails_tablet_2-A/B Trails iPad',
    },
  ];

  const expectedSelectedAppletData = {
    activities: [
      {
        key: 'activity-key-1',
        name: 'Activity 1',
        isPerformanceTask: false,
        performanceTaskType: undefined,
        items: [
          {
            name: 'Item2',
            responseType: 'multiSelect',
            responseValues: {
              options: [
                { id: 'ms-1', text: 'ms option 1', value: 0 },
                { id: 'ms-2', text: 'ms option 2', value: 1 },
              ],
            },
            key: mockUuid,
            conditionalLogic: undefined,
          },
        ],
        subscaleSetting: undefined,
        scoresAndReports: undefined,
      },
      {
        key: 'activity-key-2',
        name: 'A/B Trails iPad',
        isPerformanceTask: true,
        performanceTaskType: 'ABTrailsMobile',
        items: [
          {
            responseType: 'ABTrails',
            responseValues: null,
            config: {},
            key: mockUuid,
            name: 'ABTrails_tablet_1',
            conditionalLogic: undefined,
          },
          {
            responseType: 'ABTrails',
            responseValues: null,
            config: {},
            key: mockUuid,
            name: 'ABTrails_tablet_2',
            conditionalLogic: undefined,
          },
        ],
      },
    ],
    activityFlows: [
      {
        items: [
          {
            activityKey: 'activity-key-1',
            key: mockUuid,
          },
          {
            activityKey: 'activity-key-2',
            key: mockUuid,
          },
        ],
        key: mockUuid,
      },
    ],
  };

  test('returns correct selected applet data', () => {
    const result = getSelectedAppletData(applet, selectedItems);
    expect(result).toEqual(expectedSelectedAppletData);
  });

  test('navigateToBuilder', () => {
    const navigateMock = jest.fn();
    const appletId = 'appletId';
    const data = {
      appletId,
      appletDisplayName: 'Mocked Applet',
      appletImage: '',
    };

    navigateToBuilder(navigateMock, appletId, data);

    expect(navigateMock).toHaveBeenCalledWith(`/builder/${appletId}/about`, {
      state: { [LocationStateKeys.IsFromLibrary]: true, [LocationStateKeys.Data]: data },
    });
  });
});
