import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { t } from 'i18next';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { HelpPopup } from './HelpPopup';

const mockedTestId = 'test-id';
const mockedSetIsVisible = jest.fn();

describe('HelpPopup', () => {
  test('renders the popup correctly', async () => {
    renderWithProviders(
      <HelpPopup isVisible={true} setIsVisible={mockedSetIsVisible} data-testid={mockedTestId} />,
    );
    expect(screen.getByTestId(mockedTestId)).toBeInTheDocument();
    expect(screen.getByText(t('activityAssign.helpTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('activityAssign.helpButton'))).toBeInTheDocument();
  });

  test('clicking default submit button or close button closes the popup', async () => {
    renderWithProviders(
      <HelpPopup isVisible={true} setIsVisible={mockedSetIsVisible} data-testid={mockedTestId} />,
    );
    const submitButton = screen.getByTestId(`${mockedTestId}-submit-button`);
    await userEvent.click(submitButton);
    expect(mockedSetIsVisible).toHaveBeenCalledWith(false);

    const closeButton = screen.getByTestId(`${mockedTestId}-close-button`);
    await userEvent.click(closeButton);
    expect(mockedSetIsVisible).toHaveBeenCalledWith(false);
  });
});
