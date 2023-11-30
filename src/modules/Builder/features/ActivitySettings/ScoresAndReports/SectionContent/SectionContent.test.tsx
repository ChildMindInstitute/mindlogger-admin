// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { fireEvent, screen, within } from '@testing-library/react';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import {
  mockedAppletFormData,
  mockedScoreReport,
  mockedSectionReport,
  mockedSingleSelectFormValues,
  mockedSliderFormValues,
} from 'shared/mock';

import { SectionContent } from './SectionContent';

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
const dataTestId = 'report-section-content-name';
const commonProps = {
  name: 'activities.0.scoresAndReports.reports.1',
  title: 'Section 1',
  sectionId: 'sectionId',
  items,
  'data-testid': dataTestId,
};

const activity = mockedAppletFormData.activities[0];
const formDataWithoutSectionConditions = {
  ...mockedAppletFormData,
  activities: [
    {
      ...activity,
      scoresAndReports: {
        ...activity.scoresAndReports,
        reports: [mockedScoreReport, { ...mockedSectionReport, conditionalLogic: undefined }],
      },
    },
  ],
};

describe('SectionContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render section', () => {
    renderWithAppletFormData({ children: <SectionContent {...commonProps} /> });

    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
  });

  test('should remove conditional logic', () => {
    renderWithAppletFormData({ children: <SectionContent {...commonProps} /> });

    fireEvent.click(screen.getByTestId(`${dataTestId}-conditional-remove`));

    const removePopup = screen.getByTestId(`${dataTestId}-remove-condition-popup`);
    expect(removePopup).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Remove'));

    expect(
      within(removePopup).getByText('Conditional logic has been removed successfully.'),
    ).toBeInTheDocument();

    fireEvent.click(within(removePopup).getByText('Ok'));

    expect(screen.queryByTestId(`${dataTestId}-remove-condition-popup`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-add-condition`)).toBeInTheDocument();
  });

  test('should add conditional logic', () => {
    renderWithAppletFormData({
      children: <SectionContent {...commonProps} />,
      appletFormData: formDataWithoutSectionConditions,
    });

    fireEvent.click(screen.getByTestId(`${dataTestId}-add-condition`));

    const conditionalWrapper = screen.getByTestId(`${dataTestId}-conditional`);
    expect(conditionalWrapper).toBeInTheDocument();

    fireEvent.click(
      within(conditionalWrapper).getByTestId(`${dataTestId}-conditional-add-condition`),
    );

    expect(
      within(conditionalWrapper).getByTestId(`${dataTestId}-conditional-condition-0`),
    ).toBeInTheDocument();
  });
});
