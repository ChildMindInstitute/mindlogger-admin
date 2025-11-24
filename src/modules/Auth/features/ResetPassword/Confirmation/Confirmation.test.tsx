import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { mockedEmail } from 'shared/mock';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Confirmation } from '.';

const mockedUseNavigate = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe('Confirmation component tests', () => {
  test('renders confirmation component with email', () => {
    renderWithProviders(<Confirmation email={mockedEmail} />);

    expect(screen.getByTestId('confirmation')).toBeInTheDocument();
    const description = screen.getByTestId('confirmation-description');
    expect(description).toBeInTheDocument();

    const descriptionText = screen.getByText(
      `A password reset link is sent to ${mockedEmail} if that email is associated with a Curious account.`,
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
