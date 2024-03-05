import { getSliderRowsItemList } from './Alert.utils';

describe('Alert utils', () => {
  describe('getSliderRowsItemList', () => {
    const commonFormValues = {
      responseValues: {
        rows: [
          { id: 'slider1', minValue: 1, maxValue: 5 },
          { id: 'slider2', minValue: 2, maxValue: 8 },
        ],
      },
      alerts: [
        { sliderId: 'slider1', value: 2 },
        { sliderId: 'slider1', value: 4 },
        { sliderId: 'slider2', value: 6 },
      ],
    };
    const itemAlert = { sliderId: 'slider1' };
    const formValues1 = {
      ...commonFormValues,
      alerts: undefined,
    };
    const formValues2 = {
      responseValues: undefined,
      alerts: [],
    };
    const formValues3 = {
      ...commonFormValues,
      responseValues: {
        rows: [
          { id: 'slider1', minValue: 1, maxValue: undefined },
          {
            id: 'slider2',
            minValue: 2,
            maxValue: 8,
          },
        ],
      },
    };
    const formValues4 = {
      ...commonFormValues,
      responseValues: {
        rows: [
          { id: 'slider1', minValue: 'abc', maxValue: 5 },
          {
            id: 'slider2',
            minValue: 2,
            maxValue: 'xyz',
          },
        ],
      },
    };
    const expected1 = [
      {
        value: '1',
        labelKey: '1',
        hidden: false,
      },
      { value: '2', labelKey: '2', hidden: true },
      { value: '3', labelKey: '3', hidden: false },
      {
        value: '4',
        labelKey: '4',
        hidden: true,
      },
      { value: '5', labelKey: '5', hidden: false },
    ];
    const expected2 = [
      { value: '1', labelKey: '1', hidden: undefined },
      {
        value: '2',
        labelKey: '2',
        hidden: undefined,
      },
      { value: '3', labelKey: '3', hidden: undefined },
      { value: '4', labelKey: '4', hidden: undefined },
      {
        value: '5',
        labelKey: '5',
        hidden: undefined,
      },
    ];

    test.each`
      description                                                         | formValues          | itemAlert           | expectedItems
      ${'correct list of slider rows items'}                              | ${commonFormValues} | ${itemAlert}        | ${expected1}
      ${'correct list of slider rows items if alerts value is undefined'} | ${formValues1}      | ${itemAlert}        | ${expected2}
      ${'an empty array if response values undefined'}                    | ${formValues2}      | ${itemAlert}        | ${[]}
      ${'an empty array if sliderId is not provided'}                     | ${commonFormValues} | ${{ sliderId: '' }} | ${[]}
      ${'an empty array if minValue or maxValue is undefined'}            | ${formValues3}      | ${itemAlert}        | ${[]}
      ${'an empty array if minValue or maxValue are not valid numbers'}   | ${formValues4}      | ${itemAlert}        | ${[]}
    `('$description', ({ formValues, itemAlert, expectedItems }) => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const result = getSliderRowsItemList(formValues, itemAlert);
      expect(result).toEqual(expectedItems);
    });
  });
});
