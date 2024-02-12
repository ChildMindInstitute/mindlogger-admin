import { fireEvent, screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils';
import { mockedScoreReport, mockedSectionReport } from 'shared/mock';
import { ConditionRowType } from 'modules/Builder/types';

import { ConditionContent } from './ConditionContent';

describe('ConditionContent', () => {
  describe('should render', () => {
    test.each`
      name                      | type                        | score                | dataTestId                     | description
      ${'0.conditionalLogic.0'} | ${ConditionRowType.Score}   | ${mockedScoreReport} | ${'score-condition-content'}   | ${'for score'}
      ${'1.conditionalLogic'}   | ${ConditionRowType.Section} | ${undefined}         | ${'section-condition-content'} | ${'for section'}
    `('$description', async ({ name, type, score, dataTestId }) => {
      renderWithAppletFormData({
        children: (
          <ConditionContent
            name={`activities.0.scoresAndReports.reports.${name}`}
            type={type}
            score={score}
            data-testid={dataTestId}
          />
        ),
      });

      const componentsTestIds = ['condition-0', 'condition-1', 'add-condition', 'summary-row-match'];

      componentsTestIds.forEach((testId) => expect(screen.getByTestId(`${dataTestId}-${testId}`)).toBeInTheDocument());
    });
  });

  describe('should add condition', () => {
    test.each`
      name                      | type                        | score                | dataTestId                     | description
      ${'0.conditionalLogic.0'} | ${ConditionRowType.Score}   | ${mockedScoreReport} | ${'score-condition-content'}   | ${'for score'}
      ${'1.conditionalLogic'}   | ${ConditionRowType.Section} | ${undefined}         | ${'section-condition-content'} | ${'for section'}
    `('$description', async ({ name, type, score, dataTestId }) => {
      renderWithAppletFormData({
        children: (
          <ConditionContent
            name={`activities.0.scoresAndReports.reports.${name}`}
            type={type}
            score={score}
            data-testid={dataTestId}
          />
        ),
      });

      fireEvent.click(screen.getByTestId(`${dataTestId}-add-condition`));

      expect(screen.getByTestId(`${dataTestId}-condition-2`)).toBeInTheDocument();
      if (type === ConditionRowType.Score) {
        const itemName = screen.getByTestId(`${dataTestId}-condition-2-name`).querySelector('input');
        itemName && expect(itemName.value).toBe(mockedScoreReport.key);
      }
    });
  });

  describe('should apply default values', () => {
    test.each`
      name                      | type                        | score                | dataTestId                     | conditions                                          | description
      ${'0.conditionalLogic.0'} | ${ConditionRowType.Score}   | ${mockedScoreReport} | ${'score-condition-content'}   | ${mockedScoreReport.conditionalLogic[0].conditions} | ${'for score'}
      ${'1.conditionalLogic'}   | ${ConditionRowType.Section} | ${undefined}         | ${'section-condition-content'} | ${mockedSectionReport.conditionalLogic.conditions}  | ${'for section'}
    `('$description', async ({ name, type, score, dataTestId, conditions }) => {
      renderWithAppletFormData({
        children: (
          <ConditionContent
            name={`activities.0.scoresAndReports.reports.${name}`}
            type={type}
            score={score}
            data-testid={dataTestId}
          />
        ),
      });

      [0, 1].forEach((conditionNumber) => {
        const itemName = screen.getByTestId(`${dataTestId}-condition-${conditionNumber}-name`).querySelector('input');
        itemName && expect(itemName.value).toBe(conditions[conditionNumber].itemName);

        const type = screen.getByTestId(`${dataTestId}-condition-${conditionNumber}-type`).querySelector('input');
        type && expect(type.value).toBe(conditions[conditionNumber].type);
      });
    });
  });
});
