// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ItemResponseType } from 'shared/consts';

import {
  checkIfPerformanceTask,
  getActivities,
  getUpdatedStorageData,
  includesSearchValue,
} from './Applet.utils';

describe('checkIfPerformanceTask', () => {
  test.each`
    responseType                                | expected
    ${ItemResponseType.SingleSelection}         | ${false}
    ${ItemResponseType.MultipleSelection}       | ${false}
    ${ItemResponseType.Slider}                  | ${false}
    ${ItemResponseType.Date}                    | ${false}
    ${ItemResponseType.NumberSelection}         | ${false}
    ${ItemResponseType.TimeRange}               | ${false}
    ${ItemResponseType.SingleSelectionPerRow}   | ${false}
    ${ItemResponseType.MultipleSelectionPerRow} | ${false}
    ${ItemResponseType.SliderRows}              | ${false}
    ${ItemResponseType.Text}                    | ${false}
    ${ItemResponseType.Drawing}                 | ${false}
    ${ItemResponseType.Photo}                   | ${false}
    ${ItemResponseType.Video}                   | ${false}
    ${ItemResponseType.Geolocation}             | ${false}
    ${ItemResponseType.Audio}                   | ${false}
    ${ItemResponseType.Message}                 | ${false}
    ${ItemResponseType.AudioPlayer}             | ${false}
    ${ItemResponseType.Time}                    | ${false}
    ${ItemResponseType.Flanker}                 | ${true}
    ${ItemResponseType.StabilityTracker}        | ${true}
    ${ItemResponseType.TouchPractice}           | ${true}
    ${ItemResponseType.TouchTest}               | ${true}
    ${ItemResponseType.ABTrails}                | ${true}
  `('should return $expected for responseType $responseType', ({ responseType, expected }) => {
    const items = [{ responseType }];

    expect(checkIfPerformanceTask(items)).toBe(expected);
  });
});

describe('getUpdatedStorageData', () => {
  const applet1 = { id: '1', name: 'Applet 1' };
  const applet2 = { id: '2', name: 'Applet 2' };
  const applet3 = { id: '3', name: 'Applet 3' };
  const selectedApplet = { id: 'selected', name: 'Selected Applet' };

  test('should return an array with selectedApplet when applets is null', () => {
    const result = getUpdatedStorageData(null, selectedApplet, 'selected');
    expect(result).toEqual([selectedApplet]);
  });

  test('should return an array with selectedApplet added to applets', () => {
    const applets = [applet1, applet2, applet3];
    const result = getUpdatedStorageData(applets, selectedApplet, 'selected');
    expect(result).toEqual([applet1, applet2, applet3, selectedApplet]);
  });

  test('should replace the old applet with selectedApplet', () => {
    const applets = [applet1, applet2, selectedApplet];
    const result = getUpdatedStorageData(applets, selectedApplet, 'selected');
    expect(result).toEqual([applet1, applet2, selectedApplet]);
  });

  test('should handle an empty applets array', () => {
    const result = getUpdatedStorageData([], selectedApplet, 'selected');
    expect(result).toEqual([selectedApplet]);
  });
});

describe('includesSearchValue', () => {
  test.each`
    text             | search      | expectedResult
    ${'Hello World'} | ${'hell'}   | ${true}
    ${'Hello World'} | ${'WORLD'}  | ${true}
    ${'Any text'}    | ${''}       | ${true}
    ${'Hello World'} | ${'foo'}    | ${false}
    ${''}            | ${'search'} | ${false}
    ${''}            | ${''}       | ${true}
  `(
    'should return $expectedResult if text is "$text" and search is "$search"',
    ({ text, search, expectedResult }) => {
      const result = includesSearchValue(text, search);
      expect(result).toBe(expectedResult);
    },
  );
});

const activities = [
  {
    name: 'Activity 1 (Lorem ipsum)',
    items: [
      {
        responseType: ItemResponseType.SingleSelection,
        question: {
          en: 'Lorem ipsum is placeholder text commonly used in the graphic...',
        },
        responseValues: {
          options: [
            {
              text: 'Yes',
            },
            {
              text: 'No',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Performance Task (ABTrails)',
    items: [
      {
        responseType: ItemResponseType.ABTrails,
        question: {
          en: 'ABTrails',
        },
      },
    ],
  },
];

const setActivitiesVisible = vi.fn();

describe('getActivities', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should return updated activities with expanded state based on search (no match)', () => {
    const searchValue = 'Search';
    const result = getActivities(activities, searchValue, setActivitiesVisible);

    expect(result).toEqual([
      {
        name: 'Activity 1 (Lorem ipsum)',
        expanded: false,
        items: [
          {
            responseType: ItemResponseType.SingleSelection,
            question: { en: 'Lorem ipsum is placeholder text commonly used in the graphic...' },
            responseValues: {
              options: [
                {
                  text: 'Yes',
                },
                {
                  text: 'No',
                },
              ],
            },
            expanded: false,
          },
        ],
      },
      {
        name: 'Performance Task (ABTrails)',
        expanded: false,
        items: [
          {
            responseType: ItemResponseType.ABTrails,
            question: {
              en: 'ABTrails',
            },
          },
        ],
      },
    ]);

    expect(setActivitiesVisible).toHaveBeenCalledWith(false);
  });

  test('should return updated activities with expanded state based on search (activity name and question match)', () => {
    const searchValue = 'lorem ipsum';
    const result = getActivities(activities, searchValue, setActivitiesVisible);

    expect(result).toEqual([
      {
        name: 'Activity 1 (Lorem ipsum)',
        expanded: true,
        items: [
          {
            responseType: ItemResponseType.SingleSelection,
            question: { en: 'Lorem ipsum is placeholder text commonly used in the graphic...' },
            responseValues: {
              options: [
                {
                  text: 'Yes',
                },
                {
                  text: 'No',
                },
              ],
            },
            expanded: false,
          },
        ],
      },
      {
        name: 'Performance Task (ABTrails)',
        expanded: false,
        items: [
          {
            responseType: ItemResponseType.ABTrails,
            question: {
              en: 'ABTrails',
            },
          },
        ],
      },
    ]);

    expect(setActivitiesVisible).toHaveBeenCalledWith(true);
  });

  test('should return updated activities with expanded state based on search (option match)', () => {
    const searchValue = 'Yes';
    const result = getActivities(activities, searchValue, setActivitiesVisible);

    expect(result).toEqual([
      {
        name: 'Activity 1 (Lorem ipsum)',
        expanded: true,
        items: [
          {
            responseType: ItemResponseType.SingleSelection,
            question: { en: 'Lorem ipsum is placeholder text commonly used in the graphic...' },
            responseValues: {
              options: [
                {
                  text: 'Yes',
                },
                {
                  text: 'No',
                },
              ],
            },
            expanded: true,
          },
        ],
      },
      {
        name: 'Performance Task (ABTrails)',
        expanded: false,
        items: [
          {
            responseType: ItemResponseType.ABTrails,
            question: {
              en: 'ABTrails',
            },
          },
        ],
      },
    ]);

    expect(setActivitiesVisible).toHaveBeenCalledWith(true);
  });
});
