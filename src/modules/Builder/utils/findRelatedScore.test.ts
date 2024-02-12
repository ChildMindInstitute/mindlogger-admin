import { OptionCondition, ScoreReport } from 'redux/modules';
import {
  CalculationType,
  ConditionType,
  ConditionalLogicMatch,
  ScoreReportType,
} from 'shared/consts';

import { findRelatedScore } from './findRelatedScore';

const score1 = {
  id: 'score1',
  key: 'scoreKey1',
  name: 'Score 1',
  type: ScoreReportType.Score,
  calculationType: CalculationType.Sum,
  showMessage: true,
  printItems: true,
  itemsScore: ['item1', 'item2'],
  conditionalLogic: [
    {
      name: 'Conditional Logic 1',
      id: 'conditionalLogic1',
      flagScore: true,
      showMessage: true,
      message: 'Conditional Message 1',
      printItems: false,
      match: ConditionalLogicMatch.Any,
      conditions: [
        {
          key: 'conditionKey1',
          itemName: 'Item 1',
          type: ConditionType.IncludesOption,
          payload: {
            optionValue: 'Option1',
          },
        } as OptionCondition,
      ],
    },
  ],
};

const score2 = {
  id: 'score2',
  key: 'scoreKey2',
  name: 'Score 2',
  type: ScoreReportType.Score,
  calculationType: CalculationType.Average,
  showMessage: false,
  printItems: true,
  itemsScore: ['item3', 'item4'],
  conditionalLogic: [
    {
      name: 'Conditional Logic 2',
      id: 'conditionalLogic2',
      flagScore: false,
      showMessage: false,
      printItems: true,
      match: ConditionalLogicMatch.All,
      conditions: [
        {
          key: 'conditionKey2',
          itemName: 'Item 2',
          type: ConditionType.EqualToOption,
          payload: {
            optionValue: 'Option2',
          },
        } as OptionCondition,
      ],
    },
  ],
};

const scores = [score1, score2] as ScoreReport[];

describe('findRelatedScore', () => {
  test.each`
    entityKey              | scores    | isSaving | expected                      | description
    ${'score1'}            | ${[]}     | ${false} | ${undefined}                  | ${'findRelatedScore returns undefined for empty scores'}
    ${'score1'}            | ${scores} | ${false} | ${score1}                     | ${'findRelatedScore returns correct score by entityKey when isSaving is false'}
    ${'scoreKey1'}         | ${scores} | ${true}  | ${score1}                     | ${'findRelatedScore returns correct score by entityKey when isSaving is true'}
    ${'conditionalLogic1'} | ${scores} | ${false} | ${score1.conditionalLogic[0]} | ${'findRelatedScore returns correct conditional logic by entityKey when isSaving is false'}
    ${'conditionalLogic1'} | ${scores} | ${true}  | ${score1.conditionalLogic[0]} | ${'findRelatedScore returns correct conditional logic by entityKey when isSaving is true'}
    ${'nonExistentKey'}    | ${scores} | ${false} | ${undefined}                  | ${'findRelatedScore returns undefined for non-existent entityKey when isSaving is false'}
    ${'nonExistentKey'}    | ${scores} | ${true}  | ${undefined}                  | ${'findRelatedScore returns undefined for non-existent entityKey when isSaving is true'}
  `('$description', ({ entityKey, scores, isSaving, expected }) => {
    expect(findRelatedScore({ entityKey, scores, isSaving })).toBe(expected);
  });
});
