import { fireEvent, screen } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils';
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

    const testIds = [
      'show-message',
      'show-message-text',
      'print-items',
      'print-items-list-unselected',
    ];
    testIds.forEach((id) => expect(screen.getByTestId(`${dataTestId}-${id}`)).toBeInTheDocument());
  });

  test('should hide and unhide print items field', () => {
    renderWithAppletFormData({
      children: component,
    });

    const button = screen.getByTestId(`${dataTestId}-print-items`);
    fireEvent.click(button);

    expect(
      screen.queryByTestId(`${dataTestId}-print-items-list-unselected`),
    ).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByTestId(`${dataTestId}-print-items-list-unselected`)).toBeInTheDocument();
  });

  test('should hide and unhide message field', () => {
    renderWithAppletFormData({
      children: component,
    });

    const button = screen.getByTestId(`${dataTestId}-show-message`);
    fireEvent.click(button);

    expect(screen.queryByTestId(`${dataTestId}-show-message-text`)).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByTestId(`${dataTestId}-show-message`)).toBeInTheDocument();
  });
});
