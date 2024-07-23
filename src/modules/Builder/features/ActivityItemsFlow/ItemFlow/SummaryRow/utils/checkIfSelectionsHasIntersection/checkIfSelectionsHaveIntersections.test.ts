import { checkIfSelectionsHaveIntersections } from './checkIfSelectionsHaveIntersections';

describe('checkIfSelectionsHaveIntersections', () => {
  const conditionsSingle = [
    { type: 'EQUAL', payload: { optionValue: '1' } },
    { type: 'NOT_EQUAL', payload: { optionValue: '2' } },
  ];
  const conditionsMultiple = [
    { type: 'INCLUDES', payload: { optionValue: '1' } },
    { type: 'DOES_NOT_INCLUDE', payload: { optionValue: '2' } },
  ];
  const commonPropsSingle = {
    sameOptionValue: 'EQUAL',
    inverseOptionValue: 'NOT_EQUAL',
    isSingleSelect: true,
  };
  const commonPropsMultiple = {
    sameOptionValue: 'INCLUDES',
    inverseOptionValue: 'DOES_NOT_INCLUDE',
  };

  test.each([
    [
      'intersection between "equal/not equal" options exists',
      {
        conditions: [...conditionsSingle, { type: 'NOT_EQUAL', payload: { optionValue: '1' } }],
        ...commonPropsSingle,
        optionsLength: 3,
      },
      true,
    ],
    [
      'intersection between "includes/not includes" options exists',
      {
        conditions: [
          ...conditionsMultiple,
          { type: 'DOES_NOT_INCLUDE', payload: { optionValue: '1' } },
        ],
        ...commonPropsMultiple,
        optionsLength: 3,
      },
      true,
    ],
    [
      'more than one "equal" option is selected for Single Selection/Single Selection Per Row',
      {
        conditions: [...conditionsSingle, { type: 'EQUAL', payload: { optionValue: '2' } }],
        ...commonPropsSingle,
        optionsLength: 3,
      },
      true,
    ],
    [
      'all "not equal" options are selected simultaneously for Single Selection or Single Selection Per Row',
      {
        conditions: [...conditionsSingle, { type: 'NOT_EQUAL', payload: { optionValue: '1' } }],
        ...commonPropsSingle,
        optionsLength: 2,
      },
      true,
    ],
    [
      'both "none" option and other options are selected simultaneously for Multiple Selection',
      {
        conditions: [...conditionsMultiple, { type: 'INCLUDES', payload: { optionValue: '3' } }],
        ...commonPropsMultiple,
        optionsLength: 3,
        noneAboveId: '1',
      },
      true,
    ],
    [
      'all available options are selected simultaneously for Multiple Selection in "doesn\'t include" state',
      {
        conditions: [
          ...conditionsMultiple,
          { type: 'DOES_NOT_INCLUDE', payload: { optionValue: '1' } },
          { type: 'DOES_NOT_INCLUDE', payload: { optionValue: '3' } },
          { type: 'DOES_NOT_INCLUDE', payload: { optionValue: '4' } },
        ],
        ...commonPropsMultiple,
        optionsLength: 4,
      },
      true,
    ],
  ])('%s', (_, props, expected) => {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    expect(checkIfSelectionsHaveIntersections(props)).toBe(expected);
  });
});
