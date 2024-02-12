// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormProvider, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AssessmentActivityItem } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';
import { getDefaultFormValues } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.utils';
import { FeedbackForm } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/Feedback/Feedback.types';

import { ActivityCardItem } from './ActivityCardItem';

const mockActivityItem = {
  activityItem: {
    question: {
      en: 'Slider Question',
    },
    responseType: 'slider',
    responseValues: {
      minLabel: 'Min',
      maxLabel: 'Max',
      minValue: 0,
      maxValue: 5,
    },
    config: {
      removeBackButton: false,
      skippableItem: false,
      addScores: false,
      setAlerts: false,
      additionalResponseOption: {
        textInputOption: false,
        textInputRequired: false,
      },
      showTickMarks: true,
      showTickLabels: true,
      continuousSlider: false,
      timer: 0,
    },

    name: 'Item2',
    isHidden: false,
    allowEdit: true,
    id: 'a99ffccb-c6d2-44bf-b924-ea8e1a78ba50',
    order: 2,
  },
  answer: {
    value: 2,
    edited: null,
  },
};

const dataTestid = 'activity-card-item';

jest.mock('modules/Dashboard/features/RespondentData/CollapsedMdText', () => ({
  __esModule: true,
  ...jest.requireActual('modules/Dashboard/features/RespondentData/CollapsedMdText'),
  CollapsedMdText: ({ 'data-testid': dataTestid, text }) => <div data-testid={dataTestid}>{text}</div>,
}));

const FormComponent = ({
  children,
  assessment,
}: {
  children: React.ReactNode;
  assessment: AssessmentActivityItem[];
}) => {
  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ActivityCardItem', () => {
  test('renders component with question text', () => {
    render(
      <FormComponent assessment={[mockActivityItem]}>
        <ActivityCardItem data-testid={dataTestid} activityItem={mockActivityItem} step={0} />
      </FormComponent>,
    );
    const itemPicker = screen.getByTestId(`${dataTestid}-slider`);
    expect(itemPicker).toBeInTheDocument();

    const questionText = screen.getByTestId(`${dataTestid}-question`);
    expect(questionText).toBeInTheDocument();
    expect(questionText).toHaveTextContent('Slider Question');
  });

  test('does not render ItemCardButtons when isActive is false', () => {
    render(
      <FormComponent assessment={[mockActivityItem]}>
        <ActivityCardItem data-testid={dataTestid} activityItem={mockActivityItem} isActive={false} step={0} />
      </FormComponent>,
    );

    const itemCardButtons = screen.queryByTestId(`${dataTestid}-item-buttons`);
    expect(itemCardButtons).not.toBeInTheDocument();
  });

  test('calls toNextStep when "Next" button is clicked', async () => {
    const toNextStepMock = jest.fn();
    render(
      <FormComponent assessment={[mockActivityItem]}>
        <ActivityCardItem
          data-testid={dataTestid}
          activityItem={mockActivityItem}
          isActive={true}
          toNextStep={toNextStepMock}
          step={0}
        />
      </FormComponent>,
    );

    const itemCardButtons = await screen.findByTestId(`${dataTestid}-item-buttons`);
    expect(itemCardButtons).toBeInTheDocument();

    const nextButton = await screen.findByTestId(`${dataTestid}-item-buttons-next`);
    await userEvent.click(nextButton);
    expect(toNextStepMock).toHaveBeenCalled();

    const backButton = screen.queryByTestId(`${dataTestid}-item-buttons-back`);
    expect(backButton).not.toBeInTheDocument();
  });

  test('calls toPrevStep when "Back" button is clicked', async () => {
    const toPrevStepMock = jest.fn();
    render(
      <FormComponent assessment={[mockActivityItem]}>
        <ActivityCardItem
          data-testid={dataTestid}
          activityItem={mockActivityItem}
          isActive
          isBackVisible
          toPrevStep={toPrevStepMock}
          step={0}
        />
      </FormComponent>,
    );

    const backButton = await screen.findByTestId(`${dataTestid}-item-buttons-back`);
    await userEvent.click(backButton);
    expect(toPrevStepMock).toHaveBeenCalled();
  });
});
