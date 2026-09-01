import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { RootState } from 'redux/store';
import { mockedEmail, mockedPassword } from 'shared/mock';

import { SignUpForm } from '.';

const mockedSignUpApi = vi.hoisted(() => vi.fn());
const mockedSignInApi = vi.hoisted(() => vi.fn());

vi.mock('api', async () => ({
  ...(await vi.importActual('api')),
  signUpApi: mockedSignUpApi,
  signInApi: mockedSignInApi,
}));

const submitForm = async ({
  email,
  password,
  firstName,
  lastName,
  termsOfService,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  termsOfService?: boolean;
}) => {
  await userEvent.type(screen.getByLabelText(/Email/i), email);
  await userEvent.type(screen.getByLabelText(/Password/i), password);
  await userEvent.type(screen.getByLabelText(/First Name/i), firstName);
  await userEvent.type(screen.getByLabelText(/Last Name/i), lastName);

  if (termsOfService) {
    await userEvent.click(screen.getByTestId('signup-form-terms'));
  }

  await userEvent.click(screen.getByTestId('signup-form-signup'));
};

describe('SignUp component tests', () => {
  renderComponentForEachTest(<SignUpForm />);

  test('SignUp inputs should accept values', () => {
    inputAcceptsValue('Email', mockedEmail);
    inputAcceptsValue('Password', mockedPassword);
    inputAcceptsValue('First Name', 'fname');
    inputAcceptsValue('Last Name', 'lname');
  });

  test('should be able to validate SignUp form', async () => {
    await submitForm({
      email: 'test',
      password: 'Str0ngPass!',
      firstName: 'Jane',
      lastName: 'Doe',
      termsOfService: true,
    });
    expect(await screen.findByText('Email must be valid')).toBeInTheDocument();

    await submitForm({
      email: mockedEmail,
      password: `${mockedPassword}`,
      firstName: 'Jane',
      lastName: 'Doe',
      termsOfService: true,
    });

    // When everything is valid, password requirements should not be visible after debounce
    const requirements = await screen.findByText('All requirements have been met.');
    expect(requirements).not.toBeVisible();
  });

  test('should be able to validate SignUp when fields are empty', async () => {
    await userEvent.clear(screen.getByLabelText(/Email/i));
    await userEvent.clear(screen.getByLabelText(/Password/i));
    await userEvent.clear(screen.getByLabelText(/First Name/i));
    await userEvent.clear(screen.getByLabelText(/Last Name/i));
    await userEvent.click(screen.getByTestId('signup-form-signup'));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(await screen.findByText('Please agree to the Terms of Service')).toBeInTheDocument();
  });

  it('shows password validation error', async () => {
    await userEvent.type(screen.getByTestId('signup-form-password'), 'short');
    await userEvent.click(screen.getByTestId('signup-form-signup'));
    expect(await screen.findByText(/10 characters/i)).toBeInTheDocument();
  });
});

// Rendered per test here rather than through renderComponentForEachTest, which cannot preload state.
describe('SignUpForm while a session is running in another tab', () => {
  const sessionElsewhereState = {
    auth: { hasSessionElsewhere: true },
  } as Pick<RootState, 'auth'>;

  beforeEach(() => mockedSignUpApi.mockClear());

  // signUp ends by dispatching signIn, so this is the second session by another door.
  test('pressing create account neither signs up nor leaves the button usable', async () => {
    renderWithProviders(<SignUpForm />, { preloadedState: sessionElsewhereState });

    await submitForm({
      email: mockedEmail,
      password: mockedPassword,
      firstName: 'Ann',
      lastName: 'Smith',
      termsOfService: true,
    });

    await waitFor(() => expect(screen.getByTestId('signup-form-signup')).toBeDisabled());
    expect(mockedSignUpApi).not.toHaveBeenCalled();
  });

  // The guard sits ahead of validation, so an empty form is turned away rather than told off.
  test('submitting an empty form is turned away rather than validated', async () => {
    renderWithProviders(<SignUpForm />, { preloadedState: sessionElsewhereState });

    fireEvent.submit(screen.getByTestId('signup-form-signup').closest('form') as HTMLFormElement);

    await waitFor(() => expect(screen.getByTestId('signup-form-signup')).toBeDisabled());
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(mockedSignUpApi).not.toHaveBeenCalled();
  });

  test('the button is usable until it is pressed', () => {
    renderWithProviders(<SignUpForm />, { preloadedState: sessionElsewhereState });

    expect(screen.getByTestId('signup-form-signup')).toBeEnabled();
  });

  test('signs up as usual when no other session is running', async () => {
    // signUp calls the API and then dispatches signIn, so both have to answer.
    mockedSignUpApi.mockResolvedValue({ data: {} });
    mockedSignInApi.mockResolvedValue({ data: { result: { user: { id: 'user-1' } } } });
    renderWithProviders(<SignUpForm />);

    await submitForm({
      email: mockedEmail,
      password: mockedPassword,
      firstName: 'Ann',
      lastName: 'Smith',
      termsOfService: true,
    });

    await waitFor(() => expect(mockedSignUpApi).toHaveBeenCalledTimes(1));
  });
});
