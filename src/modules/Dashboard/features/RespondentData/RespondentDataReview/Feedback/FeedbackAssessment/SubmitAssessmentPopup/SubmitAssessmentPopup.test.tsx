// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';

import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';

const setPopupVisible = jest.fn();
const submitAssessment = jest.fn();
const dataTestid = 'respondents-review-feedback-assessment-submit-popup';

describe('SubmitAssessmentPopup', () => {
  test('the component is not rendered when property popupVisible is false', () => {
    renderWithProviders(<SubmitAssessmentPopup popupVisible={false} />);

    expect(screen.queryByTestId(dataTestid)).not.toBeInTheDocument();
  });

  test('renders the component for popupVisible = true and checks callbacks are called when buttons are clicked', async () => {
    renderWithProviders(
      <SubmitAssessmentPopup
        popupVisible={true}
        setPopupVisible={setPopupVisible}
        submitAssessment={submitAssessment}
      />,
    );

    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
    expect(screen.getByText('Submit Assessment')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to submit assessment? Only the latest version will be available on the Reviewed tab.',
      ),
    ).toBeInTheDocument();

    const closeButton = screen.getByTestId(`${dataTestid}-close-button`);
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);

    expect(setPopupVisible).toHaveBeenCalledWith(false);

    const submitButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    expect(submitAssessment).toHaveBeenCalled();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);

    expect(setPopupVisible).toHaveBeenCalledWith(false);
  });
});
