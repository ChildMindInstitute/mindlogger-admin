import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';

import { mockedAppletFormData } from 'shared/mock';

import { useFilterConditionalLogicByItem } from './useFilterConditionalLogicByItem';

const CONDITIONAL_LOGIC_FIELD_NAME = 'activities.0.conditionalLogic';

const findItemByName = (name: string) => mockedActivity.items.find((item) => item.name === name);

const mockedActivity = mockedAppletFormData.activities[0];
const mockedConditional = mockedActivity.conditionalLogic[0];
const mockedActivityWithSingleConditional = {
  ...mockedActivity,
  conditionalLogic: [mockedConditional],
};
const mockedActivityWithTwoConditionals = {
  ...mockedActivity,
  conditionalLogic: [mockedConditional, { ...mockedConditional, key: uuidv4() }],
};
const mockedActivityWithTwoDependentConditionals = {
  ...mockedActivity,
  conditionalLogic: [
    ...mockedActivityWithTwoConditionals.conditionalLogic,
    ...mockedActivity.conditionalLogic.slice(2),
  ],
};
const mockedActivityWithDependentConditional = {
  ...mockedActivity,
  conditionalLogic: [
    {
      ...mockedConditional,
      itemKey: findItemByName('Item4')?.id,
      conditions: [],
    },
  ],
};
const mockedActivityWithDependentCondition = {
  ...mockedActivity,
  conditionalLogic: [
    {
      ...mockedConditional,
      itemKey: undefined,
      conditions: [{ ...mockedConditional.conditions[0], itemName: findItemByName('Item4')?.id }],
    },
  ],
};

const mockedSetValueArgsWithoutDependentCondition = [
  CONDITIONAL_LOGIC_FIELD_NAME,
  mockedActivity.conditionalLogic.slice(1),
];
const mockedSetValueArgsWithoutConditionals = [CONDITIONAL_LOGIC_FIELD_NAME, []];
const mockedSetValueArgsWithoutTwoDependentConditions = [
  CONDITIONAL_LOGIC_FIELD_NAME,
  mockedActivity.conditionalLogic.slice(2),
];

const mockedWatch = jest.fn();
const mockedSetValue = jest.fn();
const mockedUseParams = jest.fn();
const mockedUseCurrentActivity = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    watch: mockedWatch,
    setValue: mockedSetValue,
  }),
}));
jest.mock('modules/Builder/hooks', () => ({
  ...jest.requireActual('modules/Builder/hooks'),
  useCurrentActivity: () => mockedUseCurrentActivity(),
}));

describe('useFilterConditionalLogicByItem', () => {
  test.each`
    item                       | activity                                      | expected                                           | description
    ${undefined}               | ${undefined}                                  | ${undefined}                                       | ${'setValue is not called if there is no activity'}
    ${undefined}               | ${mockedActivity}                             | ${undefined}                                       | ${'setValue is not called if there is no item provided'}
    ${findItemByName('Item4')} | ${mockedActivity}                             | ${undefined}                                       | ${'setValue is not called if item is not a part of conditionals'}
    ${findItemByName('Item1')} | ${mockedActivity}                             | ${mockedSetValueArgsWithoutDependentCondition}     | ${'conditionalLogic updates correctly with only one dependent conditional'}
    ${findItemByName('Item1')} | ${mockedActivityWithSingleConditional}        | ${mockedSetValueArgsWithoutConditionals}           | ${'conditionalLogic becomes empty array if there is only one conditional which depends on deleting item'}
    ${findItemByName('Item1')} | ${mockedActivityWithTwoConditionals}          | ${mockedSetValueArgsWithoutConditionals}           | ${'conditionalLogic is filtered correctly if there are not only the one dependent conditional'}
    ${findItemByName('Item1')} | ${mockedActivityWithTwoDependentConditionals} | ${mockedSetValueArgsWithoutTwoDependentConditions} | ${'conditionalLogic is filtered correctly if there are some dependent and independent conditionals'}
    ${findItemByName('Item4')} | ${mockedActivityWithDependentConditional}     | ${mockedSetValueArgsWithoutConditionals}           | ${'conditional is removed if item is in summary dependency'}
    ${findItemByName('Item4')} | ${mockedActivityWithDependentCondition}       | ${mockedSetValueArgsWithoutConditionals}           | ${'conditional is removed if item is in condition dependency'}
  `('$description', ({ item, activity, expected }) => {
    mockedUseParams.mockReturnValue({ activityId: activity?.id });
    mockedWatch.mockImplementation((fieldName: string) => {
      if (fieldName === CONDITIONAL_LOGIC_FIELD_NAME) {
        return activity.conditionalLogic;
      }

      return [activity];
    });

    const { result } = renderHook(() => useFilterConditionalLogicByItem(item));

    result.current();

    expected
      ? expect(mockedSetValue).toBeCalledWith(...expected, { shouldDirty: true })
      : expect(mockedSetValue).not.toBeCalled();
  });
});
