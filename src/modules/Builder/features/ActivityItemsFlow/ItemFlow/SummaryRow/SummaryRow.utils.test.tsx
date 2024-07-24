import { ItemResponseType } from 'shared/consts';
import { StyledMdPreview } from 'modules/Builder/components/ItemFlowSelectController/StyledMdPreview/StyledMdPreview.styles';

import { getItemsOptions, getItemsInUsage } from './SummaryRow.utils';

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
      },
      {
        id: 'item-6',
        name: 'TimeRange',
        responseType: ItemResponseType.TimeRange,
      },
      {
        id: 'item-7',
        name: 'Date',
        responseType: ItemResponseType.Date,
      },
      {
        id: 'item-8',
        name: 'NumberSelection',
        responseType: ItemResponseType.NumberSelection,
      },
      {
        id: 'item-9',
        name: 'item-not-included-in-the-options',
        responseType: ItemResponseType.SingleSelectionPerRow,
      },
      {
        id: 'item-10',
        name: 'MultipleSelectionPerRow',
        responseType: ItemResponseType.MultipleSelectionPerRow,
      },
      {
        id: 'item-11',
        name: 'SliderRows',
        responseType: ItemResponseType.SliderRows,
      },
      {
        id: 'item-12',
        name: 'Drawing',
        responseType: ItemResponseType.Drawing,
      },
      {
        id: 'item-13',
        name: 'Photo',
        responseType: ItemResponseType.Photo,
      },
      {
        id: 'item-14',
        name: 'Video',
        responseType: ItemResponseType.Video,
      },
      {
        id: 'item-15',
        name: 'Geolocation',
        responseType: ItemResponseType.Geolocation,
      },
      {
        id: 'item-16',
        name: 'Audio',
        responseType: ItemResponseType.Audio,
      },
      {
        id: 'item-17',
        name: 'Message',
        responseType: ItemResponseType.Message,
      },
      {
        id: 'item-18',
        name: 'AudioPlayer',
        responseType: ItemResponseType.AudioPlayer,
      },
      {
        id: 'item-19',
        name: 'item-not-included-in-the-options',
        responseType: ItemResponseType.Flanker,
      },
      {
        id: 'item-20',
        name: 'ParagraphText',
        responseType: ItemResponseType.ParagraphText,
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
        tooltip: undefined,
        value: 'item-5',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'TimeRange',
        tooltip: undefined,
        value: 'item-6',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Date',
        tooltip: undefined,
        value: 'item-7',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'NumberSelection',
        tooltip: undefined,
        value: 'item-8',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'item-not-included-in-the-options',
        tooltip: undefined,
        value: 'item-9',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'MultipleSelectionPerRow',
        tooltip: undefined,
        value: 'item-10',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'SliderRows',
        tooltip: undefined,
        value: 'item-11',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Drawing',
        tooltip: undefined,
        value: 'item-12',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Photo',
        tooltip: undefined,
        value: 'item-13',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Video',
        tooltip: undefined,
        value: 'item-14',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Geolocation',
        tooltip: undefined,
        value: 'item-15',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Audio',
        tooltip: undefined,
        value: 'item-16',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'Message',
        tooltip: undefined,
        value: 'item-17',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'AudioPlayer',
        tooltip: undefined,
        value: 'item-18',
        tooltipPlacement: undefined,
      },
      {
        disabled: false,
        labelKey: 'ParagraphText',
        value: 'item-20',
        tooltip: undefined,
        tooltipPlacement: undefined,
      },
    ];
    test('should return options with tooltips and disable statuses for items in usage', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(getItemsOptions({ items, itemsInUsage })).toStrictEqual(result);
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
