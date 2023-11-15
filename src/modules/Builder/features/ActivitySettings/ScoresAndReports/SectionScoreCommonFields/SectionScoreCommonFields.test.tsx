import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import { mockedSingleSelectFormValues, mockedSliderFormValues } from 'shared/mock';

import { SectionScoreCommonFields } from './SectionScoreCommonFields';

const dataTestId = 'section-score-common-fields';

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

const component = (
  <SectionScoreCommonFields
    name="activities.0.scoresAndReports.reports.0"
    sectionId="sectionId"
    items={items}
    data-testid={dataTestId}
  />
);

describe('SectionScoreCommonFields component tests', () => {
  test('should render component', () => {
    renderWithAppletFormData({
      children: component,
    });

    const testIds = ['show-message', 'print-items', 'print-items-list-unselected'];
    testIds.forEach((id) => expect(screen.getByTestId(`${dataTestId}-${id}`)).toBeInTheDocument());
  });

  test('should hide and unhide print items field', async () => {
    renderWithAppletFormData({
      children: component,
    });

    const button = screen.getByTestId(`${dataTestId}-print-items`);
    fireEvent.click(button);

    await waitFor(() =>
      expect(
        screen.queryByTestId(`${dataTestId}-print-items-list-unselected`),
      ).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByTestId(`${dataTestId}-print-items`));

    await waitFor(() =>
      expect(screen.getByTestId(`${dataTestId}-print-items-list-unselected`)).toBeInTheDocument(),
    );
  });
});
