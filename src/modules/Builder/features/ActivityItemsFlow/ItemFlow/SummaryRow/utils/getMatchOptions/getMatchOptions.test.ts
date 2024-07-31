// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ConditionalLogic } from 'shared/state/Applet';

import { getMatchOptions } from './getMatchOptions';

const items = [
  {
    id: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
    name: 'ItemMS',
    question: 'Choose Time?',
    responseType: 'multiSelect',
    responseValues: {
      options: [
        {
          id: '00bd67cf-e034-4217-8f3d-2c5744b398e8',
          text: 'yes',
          value: 0,
          isNoneAbove: false,
        },
        {
          id: '62e762d2-85a6-4bdc-9aa8-dfd03937f36f',
          text: 'no',
          value: 1,
          isNoneAbove: false,
        },
        {
          id: 'ca36ddba-ec35-457a-a8d0-f719282ba729',
          text: 'other',
          value: 2,
          isNoneAbove: false,
        },
        {
          id: 'a3072144-c25f-4b7e-a3e4-607ba1878bdd',
          text: 'None',
          value: 3,
          isNoneAbove: true,
        },
        {
          id: '51dba47c-922b-4067-b646-6d734d5bd069',
          text: '88888',
          value: 4,
          isNoneAbove: false,
        },
      ],
    },
    config: {},
    alerts: [],
    order: 1,
  },
  {
    id: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
    name: 'ItemSS',
    question: 'Choose Time? 2',
    responseType: 'singleSelect',
    responseValues: {
      options: [
        {
          id: '04247825-b960-4db8-9656-3715cfb4a342',
          text: 'Yes',
          value: 0,
        },
        {
          id: 'f65dc581-8ca0-49a8-940b-473de0a3cb56',
          text: 'No',
          value: 1,
        },
        {
          id: '01a0eaf8-cdff-4d22-b311-e8b2cf473c22',
          text: 'Option 3',
          value: 2,
        },
      ],
    },
    config: {},
    alerts: [],
    order: 2,
  },
  {
    id: '6e782b65-c728-4582-90fd-9fca9a14c399',
    name: 'ItemSSPR',
    question: 'sspr',
    responseType: 'singleSelectRows',
    responseValues: {
      type: 'singleSelectRows',
      rows: [
        {
          id: 'fb7d8767-2d00-41fd-b882-e41ac0f73cc5',
          rowName: 'row 1',
        },
        {
          id: '87436e9b-d390-4f33-8787-1eaa6d88e1af',
          rowName: 'row 2',
        },
      ],
      options: [
        {
          id: 'abc9086f-94f2-4bfb-a901-9c6d7ac781e9',
          text: 'option 1',
        },
        {
          id: 'ac099f3c-f89d-42bc-8702-e739efc6066d',
          text: 'option 2',
        },
        {
          id: '50d92b70-4957-491b-a18b-1f05c131239b',
          text: 'option 3',
        },
      ],
      dataMatrix: [
        {
          rowId: 'fb7d8767-2d00-41fd-b882-e41ac0f73cc5',
          options: [
            {
              optionId: 'abc9086f-94f2-4bfb-a901-9c6d7ac781e9',
              value: 0,
            },
            {
              optionId: 'ac099f3c-f89d-42bc-8702-e739efc6066d',
              value: 1,
            },
            {
              optionId: '50d92b70-4957-491b-a18b-1f05c131239b',
              value: 2,
            },
          ],
        },
        {
          rowId: '87436e9b-d390-4f33-8787-1eaa6d88e1af',
          options: [
            {
              optionId: 'abc9086f-94f2-4bfb-a901-9c6d7ac781e9',
              value: 0,
            },
            {
              optionId: 'ac099f3c-f89d-42bc-8702-e739efc6066d',
              value: 1,
            },
            {
              optionId: '50d92b70-4957-491b-a18b-1f05c131239b',
              value: 2,
            },
          ],
        },
      ],
    },
    config: {},
    alerts: [],
    order: 3,
  },
  {
    id: '0c24a7dd-0471-4433-ac39-380808ca9089',
    name: 'ItemMSPR',
    question: 'multi select per row',
    responseType: 'multiSelectRows',
    responseValues: {
      type: 'multiSelectRows',
      rows: [
        {
          id: '7ca1b426-e81a-4625-940c-b21c3563629e',
          rowName: 'row 1',
        },
        {
          id: '92cd94b3-bc2a-40ed-af56-2e113affbad1',
          rowName: 'row 2',
        },
      ],
      options: [
        {
          id: '1ab4718d-32d0-41a0-844c-b173cf8635f4',
          text: 'option 1',
        },
        {
          id: 'afa6412b-fbc3-4da1-95bf-3d510df1ecb2',
          text: 'option 2',
        },
        {
          id: '11debd39-527a-4b20-8ab5-39e5d298f1c6',
          text: 'option 3',
        },
      ],
      dataMatrix: null,
    },
    config: {},
    alerts: [],
    order: 4,
  },
  {
    id: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
    name: 'SliderRows',
    question: 'slider rows',
    responseType: 'sliderRows',
    responseValues: {
      type: 'sliderRows',
      rows: [
        {
          minValue: 0,
          maxValue: 5,
          id: '2a1a5a2c-f82e-40c0-869a-928f3f1b7b8b',
          label: 'Slider 1',
        },
        {
          minValue: 1,
          maxValue: 10,
          id: '420c1c31-3dcf-47a0-a27e-88f95a6130dd',
          label: 'Slider 2',
        },
        {
          minValue: 5,
          maxValue: 12,
          id: 'eb28686c-ac3f-47c4-9689-3212fd7555b9',
          label: 'Slider 3',
        },
      ],
    },
    config: {},
    alerts: [],
    order: 5,
  },
  {
    id: 'e7ab28ec-dcd1-49fc-8626-92bf840e8685',
    name: 'ItemTimeRange',
    question: 'Choose time range ',
    responseType: 'timeRange',
    responseValues: null,
    config: {},
    order: 6,
  },
  {
    id: '32b04b4e-e257-4533-8208-d435122eea87',
    name: 'ItemDate',
    question: 'Date',
    responseType: 'date',
    responseValues: null,
    config: {},
    order: 7,
  },
  {
    id: 'f20705f8-139e-406d-8943-6f442db92b63',
    name: 'ItemSlider',
    question: 'Slider',
    responseType: 'slider',
    responseValues: {
      minValue: 2,
      maxValue: 10,
      type: 'slider',
    },
    config: {},
    alerts: [],
    order: 8,
  },
  {
    id: 'ee523710-51c3-488a-8c12-793307775d24',
    name: 'ItemNS',
    question: 'Number Selection',
    responseType: 'numberSelect',
    responseValues: {
      type: 'numberSelect',
      minValue: 1,
      maxValue: 12,
    },
    config: {},
    order: 9,
  },
  {
    id: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
    name: 'ItemTime',
    question: 'choose time',
    responseType: 'time',
    responseValues: null,
    config: {},
    order: 10,
  },
  {
    id: 'dc27a4f0-8091-40fb-8c64-85e1c223a7cc',
    name: 'TimeRange',
    question: 'time range',
    responseType: 'timeRange',
    responseValues: null,
    config: {},
    order: 11,
  },
];
const resultFirstOption = {
  value: 'any',
  labelKey: 'Any',
};
const resultSecondOption = {
  value: 'all',
  labelKey: 'All',
  disabled: false,
  tooltip: undefined,
};
const resultNotDisabledAll = [resultFirstOption, resultSecondOption];
const resultWithDisabledAll = [
  resultFirstOption,
  {
    ...resultSecondOption,
    disabled: true,
    tooltip: "It's impossible to fulfill the specified conditions simultaneously.",
  },
];

describe('getMatchOptions', () => {
  describe('Single/Multi Select, Single/Multi Select Per Row', () => {
    const cases: [string, ConditionalLogic['conditions'], boolean][] = [
      [
        'no contradiction for Multi Select',
        [
          {
            key: '65c0586d-111f-4347-a116-3a62602d7727',
            type: 'INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '00bd67cf-e034-4217-8f3d-2c5744b398e8',
            },
          },
          {
            key: '49ff7f14-359d-4ea6-99f8-23c99f54a5cb',
            type: 'NOT_INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '62e762d2-85a6-4bdc-9aa8-dfd03937f36f',
            },
          },
        ],
        resultNotDisabledAll,
      ],
      [
        'there is contradiction for Multi Select (same value and opposite state)',
        [
          {
            key: '65c0586d-111f-4347-a116-3a62602d7727',
            type: 'INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '00bd67cf-e034-4217-8f3d-2c5744b398e8',
            },
          },
          {
            key: '49ff7f14-359d-4ea6-99f8-23c99f54a5cb',
            type: 'NOT_INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '00bd67cf-e034-4217-8f3d-2c5744b398e8',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        'some option and None option are chosen for Multi Select',
        [
          {
            key: '65c0586d-111f-4347-a116-3a62602d7727',
            type: 'INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '00bd67cf-e034-4217-8f3d-2c5744b398e8',
            },
          },
          {
            key: '49ff7f14-359d-4ea6-99f8-23c99f54a5cb',
            type: 'NOT_INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: '62e762d2-85a6-4bdc-9aa8-dfd03937f36f',
            },
          },
          {
            key: '5ff1b9e9-c3cf-474d-bd67-3a791c669d07',
            type: 'INCLUDES_OPTION',
            itemName: '3d6484db-3b7a-4b9b-928f-4078f0f829a8',
            payload: {
              optionValue: 'a3072144-c25f-4b7e-a3e4-607ba1878bdd',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        'two different "is equal to" options are chosen for Single Select',
        [
          {
            key: '65c0586d-111f-4347-a116-3a62602d7727',
            type: 'EQUAL_TO_OPTION',
            itemName: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
            payload: {
              optionValue: '04247825-b960-4db8-9656-3715cfb4a342',
            },
          },
          {
            key: '9663baaf-dd17-4790-82cd-d6a76c38be70',
            type: 'EQUAL_TO_OPTION',
            itemName: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
            payload: {
              optionValue: '01a0eaf8-cdff-4d22-b311-e8b2cf473c22',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        'two different "is equal to" options are chosen for Single Select Per Row for the same row',
        [
          {
            key: '58ce8e95-a311-416f-9d5f-0accea60e38f',
            type: 'EQUAL_TO_OPTION',
            itemName: '6e782b65-c728-4582-90fd-9fca9a14c399',
            payload: {
              optionValue: 'ac099f3c-f89d-42bc-8702-e739efc6066d',
              rowIndex: '0',
            },
          },
          {
            key: '39702247-12b6-47a5-b0eb-198487a2e51a',
            type: 'EQUAL_TO_OPTION',
            itemName: '6e782b65-c728-4582-90fd-9fca9a14c399',
            payload: {
              optionValue: 'abc9086f-94f2-4bfb-a901-9c6d7ac781e9',
              rowIndex: '0',
            },
          },
          {
            key: '7fa852d7-4443-4e6a-8218-b8469aa18077',
            type: 'EQUAL_TO_OPTION',
            itemName: '6e782b65-c728-4582-90fd-9fca9a14c399',
            payload: {
              optionValue: '50d92b70-4957-491b-a18b-1f05c131239b',
              rowIndex: '1',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        'two different "includes" options are chosen for Multi Select Per Row for the same row',
        [
          {
            key: '53537452-5f1e-4141-bf2a-ae2d4db466ff',
            type: 'INCLUDES_OPTION',
            itemName: '0c24a7dd-0471-4433-ac39-380808ca9089',
            payload: {
              optionValue: '1ab4718d-32d0-41a0-844c-b173cf8635f4',
              rowIndex: '0',
            },
          },
          {
            key: '41b57d9f-5410-4bab-aab5-d7b7d338a391',
            type: 'INCLUDES_OPTION',
            itemName: '0c24a7dd-0471-4433-ac39-380808ca9089',
            payload: {
              optionValue: 'afa6412b-fbc3-4da1-95bf-3d510df1ecb2',
              rowIndex: '0',
            },
          },
        ],
        resultNotDisabledAll,
      ],
      [
        'all options are chosen as "is not equal to" for Single Select',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'NOT_EQUAL_TO_OPTION',
            itemName: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
            payload: {
              optionValue: '04247825-b960-4db8-9656-3715cfb4a342',
            },
          },
          {
            key: '34529ea7-9c49-44d7-92aa-c257dc67c391',
            type: 'NOT_EQUAL_TO_OPTION',
            itemName: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
            payload: {
              optionValue: 'f65dc581-8ca0-49a8-940b-473de0a3cb56',
            },
          },
          {
            key: '71f553dd-5286-4839-8089-d582a667e305',
            type: 'NOT_EQUAL_TO_OPTION',
            itemName: 'a8ed3958-af68-41aa-8c14-3deaf97a3f38',
            payload: {
              optionValue: '01a0eaf8-cdff-4d22-b311-e8b2cf473c22',
            },
          },
        ],
        resultWithDisabledAll,
      ],
    ];

    test.each(cases)('returns correct result if %s', (_, conditions, expected) => {
      expect(getMatchOptions({ items, conditions })).toStrictEqual(expected);
    });
  });

  describe('Slider, Date, Number Selection, Time, Time Range, Slider Rows', () => {
    const cases: [string, ConditionalLogic['conditions'], boolean][] = [
      [
        '"greaterThanValue" and "lessThanValue" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'GREATER_THAN',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-28T21:00:00.000Z'),
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'LESS_THAN',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-29T21:00:00.000Z'),
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"greaterThanValue" and "isEqualTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'GREATER_THAN',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-28T21:00:00.000Z'),
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'EQUAL',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-28T21:00:00.000Z'),
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"greaterThanValue" and "isNotEqualTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'GREATER_THAN',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              value: '23:58',
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'NOT_EQUAL',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              value: '23:59',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"greaterThanValue" and "betweenValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'GREATER_THAN',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              value: 2,
              rowIndex: '0',
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'BETWEEN',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              maxValue: 3,
              minValue: 0,
              rowIndex: '0',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"greaterThanValue" and "outsideOfValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'GREATER_THAN',
            itemName: 'e7ab28ec-dcd1-49fc-8626-92bf840e8685',
            payload: {
              value: '16:54',
              type: 'startTime',
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'OUTSIDE_OF',
            itemName: 'e7ab28ec-dcd1-49fc-8626-92bf840e8685',
            payload: {
              minValue: '16:52',
              maxValue: '23:59',
              type: 'startTime',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"lessThanValue" and "isEqualTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'LESS_THAN',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 6,
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'EQUAL',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 6,
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"lessThanValue" and "isNotEqualTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'LESS_THAN',
            itemName: 'f20705f8-139e-406d-8943-6f442db92b63',
            payload: {
              value: 4,
            },
          },
          {
            key: 'aa05afce-a0e1-40ad-8ac2-aec0e785cd89',
            type: 'NOT_EQUAL',
            itemName: 'f20705f8-139e-406d-8943-6f442db92b63',
            payload: {
              value: 2,
            },
          },
          {
            key: 'dc2ebbaf-1199-417f-aa12-591249647bbd',
            type: 'NOT_EQUAL',
            itemName: 'f20705f8-139e-406d-8943-6f442db92b63',
            payload: {
              value: 3,
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"lessThanValue" and "betweenValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'LESS_THAN',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              value: 7,
              rowIndex: '2',
            },
          },
          {
            key: 'e02787e0-9b01-49c2-a827-8e08fab1c73d',
            type: 'BETWEEN',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              maxValue: 12,
              minValue: 9,
              rowIndex: '2',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"lessThanValue" and "outsideOfValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'LESS_THAN',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              value: '04:20',
            },
          },
          {
            key: '00596832-2ce9-418a-9c8d-8160618c12e7',
            type: 'OUTSIDE_OF',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              minValue: '00:00',
              maxValue: '17:12',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"equalTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'EQUAL',
            itemName: 'e7ab28ec-dcd1-49fc-8626-92bf840e8685',
            payload: {
              value: '17:19',
              type: 'endTime',
            },
          },
          {
            key: '00596832-2ce9-418a-9c8d-8160618c12e7',
            type: 'EQUAL',
            itemName: 'e7ab28ec-dcd1-49fc-8626-92bf840e8685',
            payload: {
              value: '17:18',
              type: 'endTime',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"equalTo" and "isNotEqualTo" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'EQUAL',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-22T21:00:00.000Z'),
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'NOT_EQUAL',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-30T21:00:00.000Z'),
            },
          },
          {
            key: 'c085ea38-d6a8-4f0b-a8a6-4d55999644de',
            type: 'NOT_EQUAL',
            itemName: '32b04b4e-e257-4533-8208-d435122eea87',
            payload: {
              value: new Date('2024-07-22T21:00:00.000Z'),
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"equalTo" and "betweenValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'EQUAL',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              value: 4,
              rowIndex: '1',
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'BETWEEN',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              maxValue: 10,
              minValue: 4,
              rowIndex: '1',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"equalTo" and "outsideValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'EQUAL',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              value: 4,
              rowIndex: '1',
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'OUTSIDE_OF',
            itemName: '0ea32249-9aa5-4f50-b998-56f458f2c2a3',
            payload: {
              maxValue: 7,
              minValue: 1,
              rowIndex: '1',
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"isNotEqualTo" and "betweenValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'NOT_EQUAL',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 2,
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'BETWEEN',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              minValue: 1,
              maxValue: 3,
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"isNotEqualTo" and "outsideValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'NOT_EQUAL',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 1,
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'OUTSIDE_OF',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              minValue: 4,
              maxValue: 12,
            },
          },
          {
            key: 'd11e2307-195d-4df7-9617-08d5443aa8e7',
            type: 'NOT_EQUAL',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 2,
            },
          },
          {
            key: '073e1a74-eeb4-4b47-bfda-6cec2948bb36',
            type: 'NOT_EQUAL',
            itemName: 'ee523710-51c3-488a-8c12-793307775d24',
            payload: {
              value: 3,
            },
          },
        ],
        resultWithDisabledAll,
      ],
      [
        '"between" and "outsideValues" contradiction',
        [
          {
            key: 'd17388c4-ae88-47f7-a092-89f8d7174fa1',
            type: 'BETWEEN',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              minValue: '17:34',
              maxValue: '23:59',
            },
          },
          {
            key: '93df2253-f2fb-4c33-bd00-3b2b7f998791',
            type: 'OUTSIDE_OF',
            itemName: 'a5ce484e-33b2-47b0-b357-ce2e2b1558cb',
            payload: {
              minValue: '17:33',
              maxValue: '23:58',
            },
          },
        ],
        resultWithDisabledAll,
      ],
    ];

    test.each(cases)('returns correct result if there is %s', (_, conditions, expected) => {
      expect(getMatchOptions({ items, conditions })).toStrictEqual(expected);
    });
  });
});
