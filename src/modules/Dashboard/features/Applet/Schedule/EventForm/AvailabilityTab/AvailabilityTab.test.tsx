// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { Periodicity } from 'modules/Dashboard/api';

import { AvailabilityTab } from './AvailabilityTab';

const dataTestid = 'availability-tab';
const defaultValues = {
  alwaysAvailable: true,
  periodicity: Periodicity.Once,
  startDate: '',
  endDate: '',
  startTime: '00:00',
  endTime: '23:59',
  reminder: null,
  removeWarning: {},
};

const FormWrapper = (props) => {
  const methods = useForm({
    mode: 'onChange',
    defaultValues: { ...props },
  });

  return (
    <FormProvider {...methods}>
      <AvailabilityTab hasAlwaysAvailableOption data-testid={dataTestid} />
    </FormProvider>
  );
};

const testRecurringEvents = ({ isOncePeriodicity = false } = {}) => {
  expect(screen.getByTestId(`${dataTestid}-start-time`)).toBeInTheDocument();
  expect(screen.getByTestId(`${dataTestid}-end-time`)).toBeInTheDocument();
  expect(screen.getByTestId(`${dataTestid}-access-before-schedule`)).toBeInTheDocument();
  expect(screen.getByTestId(`${dataTestid}-start-date`)).toBeInTheDocument();
  !isOncePeriodicity && expect(screen.getByTestId(`${dataTestid}-end-date`)).toBeInTheDocument();
};

describe('AvailabilityTab component', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('render AvailabilityTab component when alwaysAvailable = true and test periodicity change', async () => {
    renderWithProviders(<FormWrapper {...defaultValues} />);

    const alwaysAvailable = screen.getByTestId(`${dataTestid}-always-available`);
    expect(alwaysAvailable).toBeInTheDocument();
    expect(alwaysAvailable.querySelector('input')).toHaveValue('true');

    const oneTimeCompletion = screen.getByTestId(`${dataTestid}-one-time-completion`);
    expect(oneTimeCompletion).toBeInTheDocument();

    const select = alwaysAvailable.querySelectorAll('.MuiSelect-select')[0];
    await userEvent.click(select);

    const optionsWrapper = await screen.findByRole('listbox');
    const options = optionsWrapper.querySelectorAll('li');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Always available');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveTextContent('Scheduled access');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(options[1]);

    expect(screen.getByText('Users can access this activity:')).toBeInTheDocument();
    const periodicity = screen.getByTestId(`${dataTestid}-periodicity`);
    expect(periodicity).toBeInTheDocument();

    const tabsRegex = new RegExp(`${dataTestid}-periodicity-\\d+$`);
    expect(screen.queryAllByTestId(tabsRegex)).toHaveLength(5);

    // test "once" (default)
    const onceTab = screen.getByTestId(`${dataTestid}-periodicity-0`);
    expect(onceTab).toHaveTextContent('Once');
    testRecurringEvents({ isOncePeriodicity: true });
    const dailyTab = screen.getByTestId(`${dataTestid}-periodicity-1`);

    await userEvent.click(dailyTab); // test "daily"
    expect(dailyTab).toHaveTextContent('Daily');
    testRecurringEvents();
    const weeklyTab = screen.getByTestId(`${dataTestid}-periodicity-2`);

    await userEvent.click(weeklyTab); // test "weekly"
    expect(weeklyTab).toHaveTextContent('Weekly');
    testRecurringEvents();
    const weekdaysTab = screen.getByTestId(`${dataTestid}-periodicity-3`);

    await userEvent.click(weekdaysTab); // test "weekdays"
    expect(weekdaysTab).toHaveTextContent('Weekdays');
    testRecurringEvents();
    const monthlyTab = screen.getByTestId(`${dataTestid}-periodicity-4`);

    await userEvent.click(monthlyTab); // test "monthly"
    expect(monthlyTab).toHaveTextContent('Monthly');
    testRecurringEvents();
  });

  test('render AvailabilityTab component when alwaysAvailable = false and reminder and removeWarning are non-nullable', async () => {
    const props = {
      ...defaultValues,
      alwaysAvailable: false,
      startTime: '20:00',
      endTime: '08:00',
      reminder: {
        activityIncomplete: 1,
        reminderTime: '11:00:00',
      },
      removeWarning: {
        showRemoveAlwaysAvailable: true,
        showRemoveAllScheduled: true,
      },
    };

    await act(async () => {
      renderWithProviders(<FormWrapper {...props} />);
    });

    const alwaysAvailable = await screen.findByTestId(`${dataTestid}-always-available`);
    expect(alwaysAvailable).toBeInTheDocument();
    expect(alwaysAvailable.querySelector('input')).toHaveValue('false');

    expect(
      screen.getByText(
        /Once you schedule this event, the Activity will no longer be always available./,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Once you set this event to always available, all scheduled events for this activity will be removed./,
      ),
    ).toBeInTheDocument();

    const startTime = screen.getByTestId(`${dataTestid}-start-time`);
    const endTime = screen.getByTestId(`${dataTestid}-end-time`);

    expect(startTime).toBeInTheDocument();
    expect(startTime.querySelector('input')).toHaveValue('20:00');
    expect(endTime.querySelector('input')).toHaveValue('08:00');
    expect(screen.getByTestId(`${dataTestid}-end-time-wrapper`)).toHaveTextContent('Next day');

    await userEvent.click(startTime.querySelector('input') as HTMLInputElement);
    expect(startTime.querySelector('.react-datepicker__time-list')).toBeInTheDocument();
    const option07_00 = screen.getByText('07:00');
    await userEvent.click(option07_00);

    await userEvent.click(endTime.querySelector('input') as HTMLInputElement);
    expect(endTime.querySelector('.react-datepicker__time-list')).toBeInTheDocument();
    const option17_00 = screen.getByText('17:00');
    await userEvent.click(option17_00);

    expect(startTime.querySelector('input')).toHaveValue('07:00');
    expect(endTime.querySelector('input')).toHaveValue('17:00');
    expect(screen.queryByTestId(`${dataTestid}-end-time-wrapper`)).not.toHaveTextContent(
      'Next day',
    );

    // change to periodicity
    expect(screen.getByTestId(`${dataTestid}-periodicity`)).toBeInTheDocument();
    const dailyTab = screen.getByTestId(`${dataTestid}-periodicity-1`);
    await userEvent.click(dailyTab);

    // change to "always available"
    const select = alwaysAvailable.querySelectorAll('.MuiSelect-select')[0];
    await userEvent.click(select);
    await userEvent.click((await screen.findByRole('listbox')).querySelectorAll('li')[0]);
    expect(screen.getByTestId(`${dataTestid}-one-time-completion`)).toBeInTheDocument();
  });

  test('render AvailabilityTab component when alwaysAvailable = false and test date change (startDate < endDate)', async () => {
    const props = {
      ...defaultValues,
      periodicity: Periodicity.Daily,
      alwaysAvailable: false,
      startDate: new Date('03-15-2024'),
      endDate: new Date('03-20-2024'),
      startTime: '20:00',
      endTime: '08:00',
      reminder: {
        activityIncomplete: 1,
        reminderTime: '11:00:00',
      },
    };

    const user = userEvent.setup({ delay: null });

    jest.useFakeTimers();
    jest.setSystemTime(new Date('03-14-2024'));

    await act(async () => {
      renderWithProviders(<FormWrapper {...props} />);
    });

    const startDateContainer = screen.getByTestId(`${dataTestid}-start-date`);
    const endDateContainer = screen.getByTestId(`${dataTestid}-end-date`);
    expect(startDateContainer).toBeInTheDocument();
    expect(endDateContainer).toBeInTheDocument();
    expect(startDateContainer.querySelector('input')).toHaveValue('15 Mar 2024');
    expect(endDateContainer.querySelector('input')).toHaveValue('20 Mar 2024');

    await act(async () => {
      await user.click(startDateContainer.querySelector('input'));
    });

    const datepicker = await screen.findByTestId(`${dataTestid}-start-date-popover`);
    expect(datepicker).toBeInTheDocument();

    const datepickerDay = datepicker.querySelector('.react-datepicker__day--021');

    await user.click(datepickerDay);
    await user.click(screen.getByText('Ok'));

    expect(startDateContainer.querySelector('input')).toHaveValue('21 Mar 2024');
    expect(endDateContainer.querySelector('input')).toHaveValue('22 Mar 2024');

    jest.useRealTimers();
  });
});
