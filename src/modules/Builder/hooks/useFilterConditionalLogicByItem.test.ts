import { renderHook } from '@testing-library/react';
import { v4 as uuidv4 } from 'uuid';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useParams } from 'react-router-dom';

import { mockedAppletFormData } from 'shared/mock';
import { getItemConditionDependencies } from 'modules/Builder/features/ActivityItems/ActivityItems.utils';
import { useCurrentActivity } from 'modules/Builder/hooks/useCurrentActivity';

import { useCustomFormContext } from './useCustomFormContext';
import { useFilterConditionalLogicByItem } from './useFilterConditionalLogicByItem';

// Mock dependencies first, before any variable declarations
vi.mock('modules/Builder/features/ActivityItems/ActivityItems.utils', () => ({
  getItemConditionDependencies: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock('./useCustomFormContext', () => ({
  useCustomFormContext: vi.fn(),
}));

vi.mock('modules/Builder/hooks/useCurrentActivity', () => ({
  useCurrentActivity: vi.fn(),
}));

const CONDITIONAL_LOGIC_FIELD_NAME = 'activities.0.conditionalLogic';

const findItemByName = (name: string) =>
  mockedAppletFormData.activities[0].items.find((item) => item.name === name);

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

// Create mock functions after variable declarations
const mockedWatch = vi.fn();
const mockedSetValue = vi.fn();
const mockedUseParams = vi.fn();
const mockedUseCurrentActivity = vi.fn();
const mockedGetItemConditionDependencies = vi.fn();

describe('useFilterConditionalLogicByItem', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Override the default mock implementations with our test-specific ones
    vi.mocked(useParams).mockImplementation(() => mockedUseParams());
    vi.mocked(useCustomFormContext).mockImplementation(() => ({
      watch: mockedWatch,
      setValue: mockedSetValue,
    }));
    vi.mocked(useCurrentActivity).mockImplementation(() => ({
      fieldName: 'activities.0',
      activity: mockedUseCurrentActivity(),
    }));
    vi.mocked(getItemConditionDependencies).mockImplementation((item: any, conditionalLogic: any) =>
      mockedGetItemConditionDependencies(item, conditionalLogic),
    );
  });

  test.each`
    item                       | activity                                      | conditionalDependencies                                         | expected                                           | description
    ${undefined}               | ${undefined}                                  | ${undefined}                                                    | ${undefined}                                       | ${'setValue is not called if there is no activity'}
    ${undefined}               | ${mockedActivity}                             | ${undefined}                                                    | ${undefined}                                       | ${'setValue is not called if there is no item provided'}
    ${findItemByName('Item4')} | ${mockedActivity}                             | ${[]}                                                           | ${undefined}                                       | ${'setValue is not called if item is not a part of conditionals'}
    ${findItemByName('Item1')} | ${mockedActivity}                             | ${[mockedConditional]}                                          | ${mockedSetValueArgsWithoutDependentCondition}     | ${'conditionalLogic updates correctly with only one dependent conditional'}
    ${findItemByName('Item1')} | ${mockedActivityWithSingleConditional}        | ${[mockedConditional]}                                          | ${mockedSetValueArgsWithoutConditionals}           | ${'conditionalLogic becomes empty array if there is only one conditional which depends on deleting item'}
    ${findItemByName('Item1')} | ${mockedActivityWithTwoConditionals}          | ${mockedActivityWithTwoConditionals.conditionalLogic}           | ${mockedSetValueArgsWithoutConditionals}           | ${'conditionalLogic is filtered correctly if there are not only the one dependent conditional'}
    ${findItemByName('Item1')} | ${mockedActivityWithTwoDependentConditionals} | ${mockedActivityWithTwoConditionals.conditionalLogic}           | ${mockedSetValueArgsWithoutTwoDependentConditions} | ${'conditionalLogic is filtered correctly if there are some dependent and independent conditionals'}
    ${findItemByName('Item4')} | ${mockedActivityWithDependentConditional}     | ${[mockedActivityWithDependentConditional.conditionalLogic[0]]} | ${mockedSetValueArgsWithoutConditionals}           | ${'conditional is removed if item is in summary dependency'}
    ${findItemByName('Item4')} | ${mockedActivityWithDependentCondition}       | ${[mockedActivityWithDependentCondition.conditionalLogic[0]]}   | ${mockedSetValueArgsWithoutConditionals}           | ${'conditional is removed if item is in condition dependency'}
  `('$description', ({ item, activity, conditionalDependencies, expected }) => {
    // Setup mocks for this specific test
    mockedUseParams.mockReturnValue({ activityId: activity?.id });
    mockedUseCurrentActivity.mockReturnValue(activity);
    mockedGetItemConditionDependencies.mockReturnValue(conditionalDependencies);

    mockedWatch.mockImplementation((fieldName: string) => {
      if (fieldName === CONDITIONAL_LOGIC_FIELD_NAME) {
        return activity?.conditionalLogic || [];
      }

      return activity ? [activity] : [];
    });

    const { result } = renderHook(() => useFilterConditionalLogicByItem(item));

    result.current();

    if (expected) {
      expect(mockedSetValue).toHaveBeenCalledWith(expected[0], expected[1]);
    } else {
      expect(mockedSetValue).not.toHaveBeenCalled();
    }
  });
});
