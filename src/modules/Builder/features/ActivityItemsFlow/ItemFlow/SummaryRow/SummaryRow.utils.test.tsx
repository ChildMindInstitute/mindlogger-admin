import { ItemResponseType } from 'shared/consts';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';

import { getItemsOptions, getItemsInUsage } from './utils';

jest.mock(
  'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles',
  () => ({
    ...jest.requireActual(
      'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles',
    ),
    StyledMdPreview: ({ modelValue }: { modelValue: string }) => <div>{modelValue}</div>,
  }),
);

describe('SummaryRow.utils', () => {
  describe('getItemsOptions', () => {
    const items = [
      {
        id: 'item-1',
        name: 'ss1',
        responseType: ItemResponseType.SingleSelection,
        conditionalLogic: {
          itemKey: undefined,
        },
      },
      {
        id: 'item-2',
        name: 'ms1',
        responseType: ItemResponseType.MultipleSelection,
        conditionalLogic: {
          itemKey: 'item-1',
        },
        question: 'item-2',
      },
      {
        id: 'item-3',
        name: 'sl1',
        responseType: ItemResponseType.Slider,
        conditionalLogic: {
          itemKey: 'item-3',
        },
      },
      {
        id: 'item-4',
        name: 't1',
        responseType: ItemResponseType.Text,
        conditionalLogic: {
          itemKey: undefined,
        },
        question: 'item-4',
      },
      {
        id: 'item-5',
        name: 'Time',
        responseType: ItemResponseType.Time,
        conditionalLogic: {
          itemKey: 'item-4',
        },
        question: 'item-5',
      },
      {
        id: 'item-6',
        name: 'TimeRange',
        responseType: ItemResponseType.TimeRange,
        conditionalLogic: {
          itemKey: 'item-5',
        },
        question: 'item-6',
      },
      {
        id: 'item-7',
        name: 'Date',
        responseType: ItemResponseType.Date,
        conditionalLogic: {
          itemKey: 'item-6',
        },
        question: 'item-7',
      },
      {
        id: 'item-8',
        name: 'NumberSelection',
        responseType: ItemResponseType.NumberSelection,
        conditionalLogic: {
          itemKey: 'item-7',
        },
        question: 'item-8',
      },
      {
        id: 'item-9',
        name: 'item-not-included-in-the-options',
        responseType: ItemResponseType.SingleSelectionPerRow,
        conditionalLogic: {
          itemKey: 'item-8',
        },
        question: 'item-9',
      },
      {
        id: 'item-10',
        name: 'MultipleSelectionPerRow',
        responseType: ItemResponseType.MultipleSelectionPerRow,
        conditionalLogic: {
          itemKey: 'item-9',
        },
        question: 'item-10',
      },
      {
        id: 'item-11',
        name: 'SliderRows',
        responseType: ItemResponseType.SliderRows,
        conditionalLogic: {
          itemKey: 'item-10',
        },
        question: 'item-11',
      },
      {
        id: 'item-12',
        name: 'Drawing',
        responseType: ItemResponseType.Drawing,
        conditionalLogic: {
          itemKey: 'item-11',
        },
        question: 'item-12',
      },
      {
        id: 'item-13',
        name: 'Photo',
        responseType: ItemResponseType.Photo,
        conditionalLogic: {
          itemKey: 'item-12',
        },
        question: 'item-13',
      },
      {
        id: 'item-14',
        name: 'Video',
        responseType: ItemResponseType.Video,
        conditionalLogic: {
          itemKey: 'item-13',
        },
        question: 'item-14',
      },
      {
        id: 'item-15',
        name: 'Geolocation',
        responseType: ItemResponseType.Geolocation,
        conditionalLogic: {
          itemKey: 'item-14',
        },
        question: 'item-15',
      },
      {
        id: 'item-16',
        name: 'Audio',
        responseType: ItemResponseType.Audio,
        conditionalLogic: {
          itemKey: 'item-15',
        },
        question: 'item-16',
      },
      {
        id: 'item-17',
        name: 'Message',
        responseType: ItemResponseType.Message,
        conditionalLogic: {
          itemKey: 'item-16',
        },
        question: 'item-17',
      },
      {
        id: 'item-18',
        name: 'AudioPlayer',
        responseType: ItemResponseType.AudioPlayer,
        conditionalLogic: {
          itemKey: 'item-17',
        },
        question: 'item-18',
      },
      {
        id: 'item-19',
        name: 'item-not-included-in-the-options',
        responseType: ItemResponseType.Flanker,
      },
    ];
    const itemsInUsage = new Set(['item-1', 'item-3']);
    const result = [
      {
        disabled: true,
        labelKey: 'ss1',
        tooltip:
          "This item is already selected in another Conditional card's summary row. If multiple conditions are necessary, use the same Conditional card with ALL or ANY conditions.",
        value: 'item-1',
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'ms1',
        value: 'item-2',
        tooltip: <StyledMdPreview modelValue="item-2" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: true,
        labelKey: 'sl1',
        tooltip:
          "This item is already selected in another Conditional card's summary row. If multiple conditions are necessary, use the same Conditional card with ALL or ANY conditions.",
        value: 'item-3',
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 't1',
        value: 'item-4',
        tooltip: <StyledMdPreview modelValue="item-4" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Time',
        value: 'item-5',
        tooltip: <StyledMdPreview modelValue="item-5" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'TimeRange',
        value: 'item-6',
        tooltip: <StyledMdPreview modelValue="item-6" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Date',
        value: 'item-7',
        tooltip: <StyledMdPreview modelValue="item-7" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'NumberSelection',
        value: 'item-8',
        tooltip: <StyledMdPreview modelValue="item-8" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'item-not-included-in-the-options',
        value: 'item-9',
        tooltip: <StyledMdPreview modelValue="item-9" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'MultipleSelectionPerRow',
        value: 'item-10',
        tooltip: <StyledMdPreview modelValue="item-10" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'SliderRows',
        value: 'item-11',
        tooltip: <StyledMdPreview modelValue="item-11" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Drawing',
        value: 'item-12',
        tooltip: <StyledMdPreview modelValue="item-12" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Photo',
        value: 'item-13',
        tooltip: <StyledMdPreview modelValue="item-13" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Video',
        value: 'item-14',
        tooltip: <StyledMdPreview modelValue="item-14" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Geolocation',
        value: 'item-15',
        tooltip: <StyledMdPreview modelValue="item-15" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Audio',
        value: 'item-16',
        tooltip: <StyledMdPreview modelValue="item-16" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'Message',
        value: 'item-17',
        tooltip: <StyledMdPreview modelValue="item-17" />,
        tooltipPlacement: 'right',
      },
      {
        disabled: false,
        labelKey: 'AudioPlayer',
        value: 'item-18',
        tooltip: <StyledMdPreview modelValue="item-18" />,
        tooltipPlacement: 'right',
      },
    ];
    test('should return options with tooltips and disable statuses for items in usage', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(getItemsOptions({ items, itemsInUsage, conditions: [] })).toStrictEqual(result);
    });
  });

  describe('getItemsInUsage', () => {
    const conditionalLogic = [
      {
        itemKey: undefined,
      },
      {
        itemKey: 'item-1',
      },
      {
        itemKey: 'item-3',
      },
      {
        itemKey: undefined,
      },
    ];

    test.each`
      conditionalLogic    | itemKey      | expectedArrayInSet      | description
      ${conditionalLogic} | ${'item-2'}  | ${['item-1', 'item-3']} | ${'returns items when current is chosen'}
      ${conditionalLogic} | ${undefined} | ${['item-1', 'item-3']} | ${'returns items when current is empty'}
      ${conditionalLogic} | ${'item-1'}  | ${['item-3']}           | ${'returns filtered items when overlapped'}
      ${undefined}        | ${'item-1'}  | ${[]}                   | ${"returns empty list when conditional's list is empty"}
    `('$description', async ({ conditionalLogic, itemKey, expectedArrayInSet }) => {
      expect(getItemsInUsage({ conditionalLogic, itemKey })).toStrictEqual(
        new Set(expectedArrayInSet),
      );
    });
  });
});
