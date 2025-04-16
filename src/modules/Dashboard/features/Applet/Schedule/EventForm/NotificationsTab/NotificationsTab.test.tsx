import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { NotificationType } from 'modules/Dashboard/api';

import { NotificationsTab } from './NotificationsTab';

const dataTestid = 'notifications-tab';

const FormWrapper = () => {
  const methods = useForm({
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <NotificationsTab data-testid={dataTestid} />
    </FormProvider>
  );
};

describe('NotificationsTab component', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  test('render NotificationsTab component, test Notification', async () => {
    renderWithProviders(<FormWrapper />);

    expect(screen.getByText('Send Notifications')).toBeInTheDocument();
    const addNotification = screen.getByTestId(`${dataTestid}-add-notification`);
    expect(addNotification).toBeInTheDocument();
    expect(addNotification).toHaveTextContent('Add Notification');

    await userEvent.click(addNotification);

    const notification = screen.getByTestId(`${dataTestid}-notification-0`);
    expect(notification).toBeInTheDocument();
    expect(within(notification).getByText('Notification 1')).toBeInTheDocument();

    const removeButton = screen.getByTestId(`${dataTestid}-notification-0-remove`);
    expect(removeButton).toBeInTheDocument();

    const notificationType = screen.getByTestId(`${dataTestid}-notification-0-type`);
    expect(notificationType).toBeInTheDocument();

    const fixedType = within(notificationType).getByTestId(`${dataTestid}-notification-0-type-0`);
    expect(fixedType).toBeInTheDocument();
    expect(fixedType).toHaveValue(NotificationType.Fixed);
    expect(fixedType).toHaveTextContent('Fixed');
    expect(fixedType).toHaveAttribute('aria-pressed', 'true');
    expect(
      document.querySelector(`[data-testid="${dataTestid}-notification-0-type-0"] .svg-check`),
    ).toBeTruthy();

    const randomType = within(notificationType).getByTestId(`${dataTestid}-notification-0-type-1`);
    expect(randomType).toBeInTheDocument();
    expect(randomType).toHaveValue(NotificationType.Random);
    expect(randomType).toHaveTextContent('Random');
    expect(randomType).toHaveAttribute('aria-pressed', 'false');
    expect(
      document.querySelector(`[data-testid="${dataTestid}-notification-0-type-1"] .svg-check`),
    ).toBeFalsy();

    await userEvent.click(randomType);

    expect(fixedType).toHaveAttribute('aria-pressed', 'false');
    expect(
      document.querySelector(`[data-testid="${dataTestid}-notification-0-type-0"] .svg-check`),
    ).toBeFalsy();
    expect(randomType).toHaveAttribute('aria-pressed', 'true');
    expect(
      document.querySelector(`[data-testid="${dataTestid}-notification-0-type-1"] .svg-check`),
    ).toBeTruthy();

    await userEvent.click(removeButton);

    expect(screen.queryByTestId(`${dataTestid}-notification-0`)).not.toBeInTheDocument();
  });

  test('render NotificationsTab component, test Reminder', async () => {
    renderWithProviders(<FormWrapper />);

    expect(screen.getByText('Send Reminder')).toBeInTheDocument();
    const addReminder = screen.getByTestId(`${dataTestid}-add-reminder`);
    expect(addReminder).toBeInTheDocument();
    expect(addReminder).toHaveTextContent('Add Reminder');

    await userEvent.click(addReminder);

    expect(screen.queryByTestId(`${dataTestid}-add-reminder`)).not.toBeInTheDocument();

    const reminder = screen.getByTestId(`${dataTestid}-reminder`);
    expect(reminder).toBeInTheDocument();
    expect(within(reminder).getByText('Reminder')).toBeInTheDocument();

    const removeButton = screen.getByTestId(`${dataTestid}-reminder-remove`);
    expect(removeButton).toBeInTheDocument();

    await userEvent.click(removeButton);

    expect(screen.queryByTestId(`${dataTestid}-reminder`)).not.toBeInTheDocument();
  });
});
