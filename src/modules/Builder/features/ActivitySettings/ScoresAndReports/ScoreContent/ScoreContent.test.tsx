import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedSingleSelectFormValues, mockedSliderFormValues } from 'shared/mock';
import { CalculationType } from 'shared/consts';

import { ScoreContent } from './ScoreContent';

const items = [
  {
    id: mockedSingleSelectFormValues.id,
    name: mockedSingleSelectFormValues.name,
    question: mockedSingleSelectFormValues.question,
  },
  {
    id: mockedSliderFormValues.id,
    name: mockedSliderFormValues.name,
    question: mockedSliderFormValues.question,
  },
];

const scoreItems = [mockedSingleSelectFormValues, mockedSliderFormValues];

const tableItems = [
  {
    id: mockedSingleSelectFormValues.id,
    name: mockedSingleSelectFormValues.name,
    tooltip: mockedSingleSelectFormValues.question,
    label: `${mockedSingleSelectFormValues.name}: ${mockedSingleSelectFormValues.question}`,
  },
  {
    id: mockedSliderFormValues.id,
    name: mockedSliderFormValues.name,
    tooltip: mockedSliderFormValues.question,
    label: `${mockedSliderFormValues.name}: ${mockedSliderFormValues.question}`,
  },
];

const dataTestid = 'report-score-content-name';
const commonProps = {
  name: 'activities.0.scoresAndReports.reports.0',
  title: 'Score 1',
  index: 0,
  items,
  tableItems,
  scoreItems,
  'data-testid': dataTestid,
};

describe('ScoreContent', () => {
  test('should render score', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });

  describe('scoreId should change when calculation type changes', () => {
    test.each`
      calculationType               | expectedResult               | description
      ${CalculationType.Sum}        | ${'sumScore_firstscore'}     | ${'for sum type should be sumScore_firstscore'}
      ${CalculationType.Average}    | ${'averageScore_firstscore'} | ${'for average type should be averageScore_firstscore'}
      ${CalculationType.Percentage} | ${'percentScore_firstscore'} | ${'for percentage type should be percentScore_firtscore'}
    `('$description', async ({ calculationType, expectedResult }) => {
      renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

      const selectWrapper = screen.getByTestId(`${dataTestid}-calculation-type`);
      const input = selectWrapper.querySelector('input');
      input && fireEvent.change(input, { target: { value: calculationType } });

      await waitFor(() =>
        expect(screen.getByTestId(`${dataTestid}-scoreid`)).toHaveTextContent(expectedResult),
      );
    });
  });

  describe('range of scores should change when change select items', () => {
    test.each`
      checkboxIndexes | expectedResult   | description
      ${[0]}          | ${'1.00 ~ 2.00'} | ${'should be 1.00 ~ 2.00'}
      ${[1]}          | ${'1.00 ~ 4.00'} | ${'should be 1.00 ~ 4.00'}
      ${[0, 1]}       | ${'2.00 ~ 6.00'} | ${'should be 2.00 ~ 6.00'}
      ${[]}           | ${'-'}           | ${'should be -'}
    `(
      '$description',
      async ({
        checkboxIndexes,
        expectedResult,
      }: {
        checkboxIndexes: number[];
        expectedResult: string;
      }) => {
        renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

        checkboxIndexes.forEach((index) => {
          const checkboxWrapper = screen.getByTestId(
            `${dataTestid}-items-score-unselected-checkbox-${index}`,
          );
          fireEvent.click(within(checkboxWrapper).getByRole('checkbox'));
        });

        await waitFor(() =>
          expect(screen.getByTestId(`${dataTestid}-score-range`)).toHaveTextContent(expectedResult),
        );
      },
    );
  });

  test('should change scoreId when score name changes', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    const nameInput = screen.getByTestId(`${dataTestid}-name`);
    const input = nameInput.querySelector('input');
    input && fireEvent.change(input, { target: { value: 'secondScore' } });

    expect(input?.value).toBe('secondScore');
  });

  test('should remove conditional logic', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    fireEvent.click(screen.getByTestId(`${dataTestid}-conditional-0-remove`));

    const removePopup = screen.getByTestId(`${dataTestid}-remove-conditional-logic-popup`);
    expect(removePopup).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Remove'));

    expect(
      within(removePopup).getByText('Conditional logic has been removed successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Ok'));

    expect(
      screen.queryByTestId(`${dataTestid}-remove-conditional-logic-popup`),
    ).not.toBeInTheDocument();
  });

  test('should add conditional logic', () => {
    renderWithAppletFormData({ children: <ScoreContent {...commonProps} /> });

    fireEvent.click(screen.getByTestId(`${dataTestid}-add-score-conditional`));

    expect(screen.getByTestId(`${dataTestid}-conditional-1`)).toBeInTheDocument();
  });
});
