// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, fireEvent } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import i18n from 'i18n';
import {
  mockedAppletFormData,
  mockedMultiSelectFormValues,
  mockedSingleSelectFormValues,
  mockedSliderFormValues,
} from 'shared/mock';
import { getEntityKey, renderWithAppletFormData } from 'shared/utils';
import { ConditionRowType } from 'modules/Builder/types';
import { ConditionType } from 'shared/consts';

import { getItemOptions, getValueOptionsList } from '../ConditionRow.utils';
import { Condition } from './Condition';
import { ConditionItemType } from './Condition.const';

const mockedRemove = jest.fn();
const mockedItemNameChange = jest.fn();
const mockedStateChange = jest.fn();

const mockedScoreId = uuidv4();
const mockedScoreConditionId = uuidv4();

const mockedConditionName = 'activities.0.conditionalLogic.0.conditions.0';
const mockedConditional = mockedAppletFormData.activities[0].conditionalLogic[0];
const mockedSingleSelectionCondition = mockedConditional.conditions[0];
const mockedMultiSelectionCondition =
  mockedAppletFormData.activities[0].conditionalLogic[1].conditions[0];
const mockedSliderCondition = {
  key: uuidv4(),
  type: ConditionType.Equal,
  itemName: mockedSliderFormValues.id,
  payload: {
    value: 4,
  },
};
const mockedSliderRangeCondition = {
  key: uuidv4(),
  type: ConditionType.Between,
  itemName: mockedSliderFormValues.id,
  payload: {
    minValue: 1,
    maxValue: 4,
  },
};
const mockedScoreCondition = {
  key: uuidv4(),
  type: ConditionType.Equal,
  itemName: mockedScoreId,
  payload: {
    value: 4,
  },
};
const mockedScoreConditionCondition = {
  key: uuidv4(),
  type: ConditionItemType.ScoreCondition,
  itemName: mockedSingleSelectFormValues.id,
  payload: mockedSingleSelectionCondition.payload,
};

const mockedItemOptions = getItemOptions(
  mockedAppletFormData.activities[0].items,
  ConditionRowType.Item,
);
const mockedScoreOptions = [
  {
    labelKey: 'Score option',
    value: mockedScoreId,
    type: ConditionItemType.Score,
  },
];
const mockedScoreConditionOptions = [
  {
    labelKey: 'Score condition',
    value: mockedScoreConditionId,
    type: ConditionItemType.ScoreCondition,
  },
];
const mockedValueOptions = getValueOptionsList(
  mockedAppletFormData.activities[0].items.find(
    (item) => getEntityKey(item) === mockedConditional.itemKey,
  ),
);

const mockedNames = {
  itemName: `${mockedConditionName}.itemName`,
  stateName: `${mockedConditionName}.type`,
  optionValueName: `${mockedConditionName}.payload.optionValue`,
  numberValueName: `${mockedConditionName}.payload.value`,
  minValueName: `${mockedConditionName}.payload.minValue`,
  maxValueName: `${mockedConditionName}.payload.maxValue`,
};
const mockedPropsForEditingCondition = {
  ...mockedNames,
  itemOptions: mockedItemOptions,
  valueOptions: mockedValueOptions,
  item: mockedSingleSelectionCondition.itemName,
  state: mockedSingleSelectionCondition.type,
  onItemChange: mockedItemNameChange,
  onStateChange: mockedStateChange,
  onRemove: mockedRemove,
  type: ConditionRowType.Item,
  'data-testid': 'editing-condition',
};
const mockedPropsForEmptyCondition = {
  ...mockedNames,
  item: undefined,
  itemOptions: mockedItemOptions,
  onItemChange: mockedItemNameChange,
  onStateChange: mockedStateChange,
  onRemove: mockedRemove,
  type: ConditionRowType.Item,
  'data-testid': 'empty-condition',
};

const getAppletFormData = (condition) => ({
  ...mockedAppletFormData,
  activities: [
    {
      ...mockedAppletFormData.activities[0],
      conditionalLogic: [{ conditions: [condition] }],
    },
  ],
});

const mockedStateOptionLabels = () => {
  const { t } = i18n;

  return {
    [ConditionItemType.MultiSelection]: [t('includesOption'), t('notIncludesOption')],
    [ConditionItemType.SingleSelection]: [t('equalToOption'), t('notEqualToOption')],
    [ConditionItemType.Slider]: [
      t('greaterThan'),
      t('lessThan'),
      t('equal'),
      t('notEqual'),
      t('between'),
      t('outsideOf'),
    ],
    [ConditionItemType.Score]: [
      t('greaterThan'),
      t('lessThan'),
      t('equal'),
      t('notEqual'),
      t('between'),
      t('outsideOf'),
    ],
    [ConditionItemType.ScoreCondition]: [t('equal')],
  };
};

describe('Condition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('empty condition is rendered', () => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} />,
    });

    expect(screen.getByTestId('empty-condition')).toBeInTheDocument();
  });

  test('condition has default fields', () => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} />,
    });

    expect(screen.getByTestId('empty-condition-name')).toBeInTheDocument();
    expect(screen.getByTestId('empty-condition-type')).toBeInTheDocument();
    expect(screen.getByTestId('empty-condition-selection-value')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-condition-remove')).not.toBeInTheDocument();
  });

  test('empty condition has remove button if isRemoveVisible is true', () => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} isRemoveVisible />,
    });

    expect(screen.getByTestId('empty-condition-remove')).toBeInTheDocument();
  });

  test('onRemove callback is invoked after click remove button', () => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} isRemoveVisible />,
    });

    const removeButton = screen.getByTestId('empty-condition-remove');

    fireEvent.click(removeButton);

    expect(mockedRemove).toBeCalled();
  });

  test('empty condition has filled in with item name options', () => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} />,
    });

    const itemNameSelect = screen.getByTestId('empty-condition-name');
    const itemNameSelectButton = itemNameSelect.querySelector('[role="button"]');

    fireEvent.mouseDown(itemNameSelectButton!);

    const itemNameDropdown = screen.getByTestId('empty-condition-name-dropdown');
    expect(itemNameDropdown).toBeInTheDocument();

    const itemNameDropdownOptions = itemNameDropdown.querySelectorAll('li');

    itemNameDropdownOptions.forEach((option, index) =>
      expect(option).toHaveTextContent(mockedItemOptions[index].labelKey),
    );
  });

  test.each`
    testId               | description
    ${'type'}            | ${'state is disabled if there is not item selected'}
    ${'selection-value'} | ${'value is disabled if there is not item selected'}
  `('$description', ({ testId }) => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEmptyCondition} />,
    });

    expect(screen.getByTestId(`empty-condition-${testId}`).querySelector('input')).toBeDisabled();
  });

  test.each`
    item                               | type                                 | itemOptions                                 | description
    ${mockedSliderFormValues.id}       | ${ConditionItemType.Slider}          | ${mockedPropsForEmptyCondition.itemOptions} | ${'condition state options for slider should be greaterThan/lessThan/equal/notEqual/between/outsideOf'}
    ${mockedSingleSelectFormValues.id} | ${ConditionItemType.SingleSelection} | ${mockedPropsForEmptyCondition.itemOptions} | ${'condition state options for singleSelection should be equalToOption/notEqualToOption'}
    ${mockedMultiSelectFormValues.id}  | ${ConditionItemType.MultiSelection}  | ${mockedPropsForEmptyCondition.itemOptions} | ${'condition state options for multiSelection should be includesOption/notIncludesOption'}
    ${mockedScoreConditionId}          | ${ConditionItemType.ScoreCondition}  | ${mockedScoreConditionOptions}              | ${'condition state options for scoreCondition should be equal'}
    ${mockedScoreId}                   | ${ConditionItemType.Score}           | ${mockedScoreOptions}                       | ${'condition state options for score should be greaterThan/lessThan/equal/notEqual/between/outsideOf'}
  `('$description', ({ item, type, itemOptions }) => {
    renderWithAppletFormData({
      children: (
        <Condition
          {...mockedPropsForEmptyCondition}
          item={item}
          type={type}
          itemOptions={itemOptions}
        />
      ),
    });

    if (type !== ConditionItemType.Score) {
      const selectItem = screen.getByTestId('empty-condition-name');
      const selectItemButton = selectItem.querySelector('[role="button"]');

      fireEvent.mouseDown(selectItemButton);

      const selectItemDropdown = screen.getByTestId('empty-condition-name-dropdown');
      const itemSelectOptions = selectItemDropdown.querySelectorAll('li');

      fireEvent.click([...itemSelectOptions].find((option) => option.dataset.value === item));
    }

    const selectState = screen.getByTestId('empty-condition-type');
    const selectStateButton = selectState.querySelector('[role="button"]');

    fireEvent.mouseDown(selectStateButton);

    const selectStateDropdown = screen.getByTestId('empty-condition-type-dropdown');
    const selectStateOptions = selectStateDropdown.querySelectorAll('li');

    selectStateOptions.forEach((stateOption, index) => {
      expect(stateOption.textContent).toBe(mockedStateOptionLabels()[type][index]);
    });
  });

  test.each`
    testId    | handler                 | description
    ${'name'} | ${mockedItemNameChange} | ${'onItemChange should be invoked if item name is changed'}
    ${'type'} | ${mockedStateChange}    | ${'onStateChange should be invoked if state is changed'}
  `('$description', ({ testId, handler }) => {
    renderWithAppletFormData({
      children: <Condition {...mockedPropsForEditingCondition} />,
    });

    const select = screen.getByTestId(`editing-condition-${testId}`);
    const selectButton = select.querySelector('[role="button"]');

    fireEvent.mouseDown(selectButton);

    const selectDropdown = screen.getByTestId(`editing-condition-${testId}-dropdown`);
    const selectOption = selectDropdown.querySelector('li:last-child');

    fireEvent.click(selectOption);

    expect(handler).toBeCalled();
  });

  test.each`
    testIds                       | item                               | state                        | options                        | description
    ${['selection-value']}        | ${mockedSingleSelectFormValues.id} | ${''}                        | ${mockedItemOptions}           | ${'value is shown as select if item is single select'}
    ${['selection-value']}        | ${mockedMultiSelectFormValues.id}  | ${''}                        | ${mockedItemOptions}           | ${'value is shown as select if item is multi select'}
    ${['selection-value']}        | ${mockedScoreConditionId}          | ${''}                        | ${mockedScoreConditionOptions} | ${'value is shown as select if item is score condition'}
    ${['selection-value']}        | ${undefined}                       | ${''}                        | ${mockedItemOptions}           | ${'value is shown as select if item is not provided'}
    ${['slider-value']}           | ${mockedSliderFormValues.id}       | ${ConditionType.GreaterThan} | ${mockedItemOptions}           | ${'slider value is shown if item is slider and state is "greater than"'}
    ${['slider-value']}           | ${mockedSliderFormValues.id}       | ${ConditionType.LessThan}    | ${mockedItemOptions}           | ${'slider value is shown if item is slider and state is "less than"'}
    ${['slider-value']}           | ${mockedSliderFormValues.id}       | ${ConditionType.Equal}       | ${mockedItemOptions}           | ${'slider value is shown if item is slider and state is "equal"'}
    ${['slider-value']}           | ${mockedSliderFormValues.id}       | ${ConditionType.NotEqual}    | ${mockedItemOptions}           | ${'slider value is shown if item is slider and state is "not equal"'}
    ${['slider-value']}           | ${mockedScoreId}                   | ${ConditionType.GreaterThan} | ${mockedScoreOptions}          | ${'slider value is shown if item is score and state is "greater than"'}
    ${['slider-value']}           | ${mockedScoreId}                   | ${ConditionType.LessThan}    | ${mockedScoreOptions}          | ${'slider value is shown if item is score and state is "less than"'}
    ${['slider-value']}           | ${mockedScoreId}                   | ${ConditionType.Equal}       | ${mockedScoreOptions}          | ${'slider value is shown if item is score and state is "equal"'}
    ${['slider-value']}           | ${mockedScoreId}                   | ${ConditionType.NotEqual}    | ${mockedScoreOptions}          | ${'slider value is shown if item is score and state is "not equal"'}
    ${['min-value', 'max-value']} | ${mockedSliderFormValues.id}       | ${ConditionType.Between}     | ${mockedItemOptions}           | ${'range value is shown if item is slider and state is "between"'}
    ${['min-value', 'max-value']} | ${mockedSliderFormValues.id}       | ${ConditionType.OutsideOf}   | ${mockedItemOptions}           | ${'range value is shown if item is slider and state is "outside of"'}
    ${['min-value', 'max-value']} | ${mockedScoreId}                   | ${ConditionType.Between}     | ${mockedScoreOptions}          | ${'range value is shown if item is score and state is "between"'}
    ${['min-value', 'max-value']} | ${mockedScoreId}                   | ${ConditionType.OutsideOf}   | ${mockedScoreOptions}          | ${'range value is shown if item is score and state is "between"'}
  `('$description', ({ testIds, item, state, options }) => {
    renderWithAppletFormData({
      children: (
        <Condition
          {...mockedPropsForEditingCondition}
          item={item}
          state={state}
          itemOptions={options}
        />
      ),
    });

    expect(screen.getByTestId(`editing-condition-${testIds[0]}`)).toBeInTheDocument();
    testIds[1] && expect(screen.getByTestId(`editing-condition-${testIds[1]}`)).toBeInTheDocument();
  });

  test.each`
    condition                         | rowType                     | itemOptions                    | valueTestIds                  | expectedValues                                                                                          | description
    ${mockedSingleSelectionCondition} | ${ConditionRowType.Item}    | ${mockedItemOptions}           | ${['selection-value']}        | ${[mockedSingleSelectionCondition.payload.optionValue]}                                                 | ${'filled condition with single selection renders correctly'}
    ${mockedMultiSelectionCondition}  | ${ConditionRowType.Item}    | ${mockedItemOptions}           | ${['selection-value']}        | ${[mockedMultiSelectionCondition.payload.optionValue]}                                                  | ${'filled condition with multi selection renders correctly'}
    ${mockedSliderCondition}          | ${ConditionRowType.Item}    | ${mockedItemOptions}           | ${['slider-value']}           | ${[`${mockedSliderCondition.payload.value}`]}                                                           | ${'filled condition with slider renders correctly'}
    ${mockedSliderRangeCondition}     | ${ConditionRowType.Item}    | ${mockedItemOptions}           | ${['min-value', 'max-value']} | ${[`${mockedSliderRangeCondition.payload.minValue}`, `${mockedSliderRangeCondition.payload.maxValue}`]} | ${'filled condition with slider range renders correctly'}
    ${mockedScoreCondition}           | ${ConditionRowType.Score}   | ${mockedScoreOptions}          | ${['slider-value']}           | ${[`${mockedScoreCondition.payload.value}`]}                                                            | ${'filled condition with score render correctly'}
    ${mockedScoreConditionCondition}  | ${ConditionRowType.Section} | ${mockedScoreConditionOptions} | ${['selection-value']}        | ${[`${mockedScoreConditionCondition.payload.optionValue}`]}                                             | ${'filled condition with score condition render correctly'}
  `('$description', ({ condition, rowType, itemOptions, valueTestIds, expectedValues }) => {
    renderWithAppletFormData({
      children: (
        <Condition
          {...mockedPropsForEditingCondition}
          item={condition.itemName}
          state={condition.type}
          itemOptions={itemOptions}
          type={rowType}
        />
      ),
      appletFormData: getAppletFormData(condition),
    });

    expect(screen.getByTestId('editing-condition-name').querySelector('input').value).toBe(
      condition.itemName,
    );
    expect(screen.getByTestId('editing-condition-type').querySelector('input').value).toBe(
      condition.type,
    );
    expect(
      screen.getByTestId(`editing-condition-${valueTestIds[0]}`).querySelector('input').value,
    ).toBe(expectedValues[0]);
    valueTestIds[1] &&
      expect(
        screen.getByTestId(`editing-condition-${valueTestIds[1]}`).querySelector('input').value,
      ).toBe(expectedValues[1]);
  });
});
