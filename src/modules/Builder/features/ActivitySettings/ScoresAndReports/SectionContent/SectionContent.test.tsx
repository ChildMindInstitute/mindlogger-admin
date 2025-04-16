// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithAppletFormData } from 'shared/utils/renderWithAppletFormData';
import {
  mockedAppletFormData,
  mockedScoreReport,
  mockedSectionReport,
  mockedSingleSelectFormValues,
  mockedSliderFormValues,
} from 'shared/mock';
import * as useCustomFormContextHook from 'modules/Builder/hooks/useCustomFormContext';
import { ConditionalLogicMatch } from 'shared/consts';

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
    vi.clearAllMocks();
  });

  test('should render section', () => {
    const { getByTestId } = renderWithAppletFormData({
      children: <SectionContent {...commonProps} />,
    });

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  test('should remove conditional logic', async () => {
    const { getByTestId, queryByTestId } = renderWithAppletFormData({
      children: <SectionContent {...commonProps} />,
    });

    await userEvent.click(getByTestId(`${dataTestId}-conditional-remove`));

    const removePopup = getByTestId(`${dataTestId}-remove-condition-popup`);
    expect(removePopup).toBeInTheDocument();

    await userEvent.click(within(removePopup).getByText('Remove'));

    expect(
      within(removePopup).getByText('Conditional logic has been removed successfully.'),
    ).toBeInTheDocument();

    await userEvent.click(within(removePopup).getByText('Ok'));

    expect(queryByTestId(`${dataTestId}-remove-condition-popup`)).not.toBeInTheDocument();
    expect(getByTestId(`${dataTestId}-add-condition`)).toBeInTheDocument();
  });

  test('should add conditional logic', async () => {
    const { getByTestId } = renderWithAppletFormData({
      children: <SectionContent {...commonProps} />,
      appletFormData: formDataWithoutSectionConditions,
    });

    await userEvent.click(getByTestId(`${dataTestId}-add-condition`));

    const conditionalWrapper = getByTestId(`${dataTestId}-conditional`);
    expect(conditionalWrapper).toBeInTheDocument();

    await userEvent.click(
      within(conditionalWrapper).getByTestId(`${dataTestId}-conditional-add-condition`),
    );

    expect(
      within(conditionalWrapper).getByTestId(`${dataTestId}-conditional-condition-0`),
    ).toBeInTheDocument();
  });

  test('should set correct default conditional logic value', async () => {
    const mockedSetValue = vi.fn();
    jest
      .spyOn(useCustomFormContextHook, 'useCustomFormContext')
      .mockReturnValue({ setValue: mockedSetValue });

    const { getByTestId } = renderWithAppletFormData({
      children: <SectionContent {...commonProps} />,
      appletFormData: formDataWithoutSectionConditions,
    });

    await userEvent.click(getByTestId(`${dataTestId}-add-condition`));

    expect(mockedSetValue).nthCalledWith(
      1,
      'activities.0.scoresAndReports.reports.1.conditionalLogic',
      {
        id: expect.any(String),
        name: 'section-condition',
        conditions: [],
        match: ConditionalLogicMatch.All,
      },
    );
  });
});
