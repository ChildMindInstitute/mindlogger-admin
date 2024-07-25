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
        name: 'item-not-included-in-the-options',
        responseType: ItemResponseType.Drawing,
      },
    ];
    const itemsInUsage = new Set(['item-1', 'item-3']);
    const conditions = [
      {
        key: 'key-1',
        type: 'INCLUDES_OPTION',
        itemName: 'item-2',
        payload: {
          optionValue: 'option-value-1',
        },
      },
    ];
    const result = [
      {
        disabled: true,
        labelKey: 'ss1',
        tooltip:
          'This Item appears in the Activity before one of the Items involved in the conditional.',
        value: 'item-1',
        tooltipPlacement: 'right',
      },
      {
        disabled: true,
        labelKey: 'ms1',
        value: 'item-2',
        tooltip:
          'This Item already defines one of the conditions and cannot be its result at the same time.',
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
    ];
    test('should return options with tooltips and disable statuses for items in usage', () => {
      //eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      expect(getItemsOptions({ items, itemsInUsage, conditions })).toStrictEqual(result);
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
