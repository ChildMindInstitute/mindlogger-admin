import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';
import { mockedEmail } from 'shared/mock';

import { Confirmation } from '.';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('Confirmation component tests', () => {
  test('renders confirmation component with email', () => {
    renderWithProviders(<Confirmation email={mockedEmail} />);

    expect(screen.getByTestId('confirmation')).toBeInTheDocument();
    const description = screen.getByTestId('confirmation-description');
    expect(description).toBeInTheDocument();

    const descriptionText = screen.getByText(
      `A password reset link is sent to ${mockedEmail} if that email is associated with a MindLogger account.`,
    );
    expect(descriptionText).toBeInTheDocument();
  });

  test('navigates to login page on button click', async () => {
    renderWithProviders(<Confirmation email={mockedEmail} />);

    const button = screen.getByTestId('confirmation-button');
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(mockedUseNavigate).toBeCalledWith('/auth');
  });
});
