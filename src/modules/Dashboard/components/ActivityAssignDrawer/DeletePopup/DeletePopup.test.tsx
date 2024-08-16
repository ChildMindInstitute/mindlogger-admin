import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { t } from 'i18next';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { DeletePopup } from './DeletePopup';

const mockedTestId = 'test-id';
const mockedSetIsVisible = jest.fn();
const mockedOnConfirm = jest.fn();
const mockedActivityName = 'activity';

describe('DeletePopup', () => {
  test('renders the popup correctly', async () => {
    renderWithProviders(
      <DeletePopup
        isVisible={true}
        setIsVisible={mockedSetIsVisible}
        onConfirm={mockedOnConfirm}
        activityName={mockedActivityName}
        data-testid={mockedTestId}
      />,
    );
    expect(screen.getByTestId(mockedTestId)).toBeInTheDocument();
    expect(screen.getByText(t('activityAssign.deletePopupTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('activityAssign.deletePopupButton'))).toBeInTheDocument();
    expect(
      screen.getByText(t('activityAssign.deletePopupText', { activityName: mockedActivityName })),
    ).toBeInTheDocument();
  });

  test('clicking default submit button or close button closes the popup', async () => {
    renderWithProviders(
      <DeletePopup
        isVisible={true}
        setIsVisible={mockedSetIsVisible}
        onConfirm={mockedOnConfirm}
        activityName={mockedActivityName}
        data-testid={mockedTestId}
      />,
    );
    const submitButton = screen.getByTestId(`${mockedTestId}-submit-button`);
    await userEvent.click(submitButton);
    expect(mockedSetIsVisible).toHaveBeenCalledWith(false);
    expect(mockedOnConfirm).toHaveBeenCalled();

    const closeButton = screen.getByTestId(`${mockedTestId}-close-button`);
    await userEvent.click(closeButton);
    expect(mockedSetIsVisible).toHaveBeenCalledWith(false);
  });
});
