/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { Periodicity } from 'modules/Dashboard/api';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { Reminder } from './Reminder';

const dataTestid = 'reminder';
const startDate = new Date('04-03-2024');
const endDate = new Date('12-31-2024');

const FormWrapper = ({ defaultValues }) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <Reminder data-testid={dataTestid} />
    </FormProvider>
  );
};

describe('Reminder component', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('render Reminder component, periodicity = WEEKLY', async () => {
    const defaultValues = {
      periodicity: Periodicity.Weekly,
      startDate,
      endDate,
      startTime: '00:00',
      endTime: '23:59',
      reminder: {
        activityIncomplete: 0,
        reminderTime: '00:00',
      },
    };

    await act(() => {
      renderWithProviders(<FormWrapper defaultValues={defaultValues} />);
    });

    expect(screen.getByText('Reminder')).toBeInTheDocument();
    const header = screen.getByTestId(`${dataTestid}-header`);
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Curious');
    const img = header.querySelector('img');
    expect(img).toBeInTheDocument();

    const removeButton = screen.getByTestId(`${dataTestid}-remove`);
    expect(removeButton).toBeInTheDocument();

    const activityIncomplete = screen.getByTestId(`${dataTestid}-activity-incomplete`);
    expect(activityIncomplete).toBeInTheDocument();
    const activityIncompleteInput = activityIncomplete.querySelector('input');
    expect(activityIncompleteInput).toBeInTheDocument();
    expect(activityIncompleteInput).toHaveValue(0);

    const reminderTime = screen.getByTestId(`${dataTestid}-reminder-time`);
    expect(reminderTime).toBeInTheDocument();
    const reminderTimeInput = reminderTime.querySelector('input');
    expect(reminderTimeInput).toBeInTheDocument();
    expect(reminderTimeInput).toHaveValue('00:00');

    const buttonArrowUp = within(activityIncomplete).getByTestId('button-arrow-up');
    expect(buttonArrowUp).toBeInTheDocument();
    await userEvent.click(buttonArrowUp);
    expect(activityIncompleteInput).toHaveValue(7);

    // press the arrow up button twice
    await userEvent.click(buttonArrowUp);
    await userEvent.click(buttonArrowUp);
    expect(activityIncompleteInput).toHaveValue(21);

    // press the arrow down button
    const buttonArrowDown = within(activityIncomplete).getByTestId('button-arrow-down');
    expect(buttonArrowDown).toBeInTheDocument();
    await userEvent.click(buttonArrowDown);
    expect(activityIncompleteInput).toHaveValue(14);

    // test remove reminder
    await userEvent.click(removeButton);
    expect(screen.queryByTestId(`${dataTestid}-reminder`)).not.toBeInTheDocument();
  });

  test('render Reminder component, periodicity = WEEKDAYS', async () => {
    const defaultValues = {
      periodicity: Periodicity.Weekdays,
      startDate,
      endDate,
      startTime: '00:00',
      endTime: '23:59',
      reminder: {
        activityIncomplete: 2,
        reminderTime: '12:30',
      },
    };
    await act(() => {
      renderWithProviders(<FormWrapper defaultValues={defaultValues} />);
    });

    expect(screen.getByText('Reminder')).toBeInTheDocument();
    const header = screen.getByTestId(`${dataTestid}-header`);
    expect(header).toBeInTheDocument();

    const activityIncomplete = screen.getByTestId(`${dataTestid}-activity-incomplete`);
    expect(activityIncomplete).toBeInTheDocument();
    const activityIncompleteInput = activityIncomplete.querySelector('input');
    expect(activityIncompleteInput).toBeInTheDocument();
    expect(activityIncompleteInput).toHaveValue(2);

    const reminderTime = screen.getByTestId(`${dataTestid}-reminder-time`);
    expect(reminderTime).toBeInTheDocument();
    const reminderTimeInput = reminderTime.querySelector('input');
    expect(reminderTimeInput).toBeInTheDocument();
    expect(reminderTimeInput).toHaveValue('12:30');

    const weekdaysReminderMessage = screen.getByTestId(`${dataTestid}-weekdays-reminder-message`);
    expect(weekdaysReminderMessage).toBeInTheDocument();
    expect(weekdaysReminderMessage).toHaveTextContent(
      "Note: System won't send reminders on weekends, as the activity is limited to weekdays.",
    );

    // press the arrow up button
    const buttonArrowUp = within(activityIncomplete).getByTestId('button-arrow-up');
    expect(buttonArrowUp).toBeInTheDocument();
    await userEvent.click(buttonArrowUp);
    expect(activityIncompleteInput).toHaveValue(3);

    // input value
    await userEvent.clear(activityIncompleteInput);
    await userEvent.type(activityIncompleteInput, '7');
    expect(activityIncompleteInput).toHaveValue(7);
  });
});
