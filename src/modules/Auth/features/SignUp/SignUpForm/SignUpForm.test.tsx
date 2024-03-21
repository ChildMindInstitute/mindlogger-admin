import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { inputAcceptsValue } from 'shared/tests/inputAcceptsValue';
import { renderComponentForEachTest } from 'shared/utils/renderComponentForEachTest';
import { mockedEmail, mockedPassword } from 'shared/mock';

import { SignUpForm } from '.';

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
      password: 'password',
      firstName: 'Jane',
      lastName: 'Doe',
      termsOfService: true,
    });
    expect(await screen.findByText('Email must be valid')).toBeInTheDocument();

    await submitForm({
      email: mockedEmail,
      password: ` ${mockedPassword}`,
      firstName: 'Jane',
      lastName: 'Doe',
      termsOfService: true,
    });
    expect(await screen.findByText('Password must not contain spaces.')).toBeInTheDocument();
  });

  test('should be able to validate SignUp when fields are empty', async () => {
    await userEvent.clear(screen.getByLabelText(/Email/i));
    await userEvent.clear(screen.getByLabelText(/Password/i));
    await userEvent.clear(screen.getByLabelText(/First Name/i));
    await userEvent.clear(screen.getByLabelText(/Last Name/i));
    await userEvent.click(screen.getByTestId('signup-form-signup'));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(await screen.findByText('Please agree to the Terms of Service')).toBeInTheDocument();
  });
});
