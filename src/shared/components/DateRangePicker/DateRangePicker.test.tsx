import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import type { MutableRefObject } from 'react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { DateRangePicker } from './DateRangePicker';
import { DateRangePickerFormValues, DateRangePickerType } from './DateRangePicker.types';

const testId = 'date-range-test';

const minDate = new Date('2025-07-01T08:00:00.000Z');
const maxDate = new Date('2025-07-15T12:00:00.000Z');

type DateRangePickerHarnessProps = {
  defaultDateType?: DateRangePickerType;
  formRef?: MutableRefObject<UseFormReturn<DateRangePickerFormValues> | null>;
};

const DateRangePickerHarness = ({
  defaultDateType = DateRangePickerType.AllTime,
  formRef,
}: DateRangePickerHarnessProps) => {
  // useForm runs in the harness; FormProvider shares that instance with descendants so
  // DateRangePicker can call useFormContext() and attach to the same form.
  const methods = useForm<DateRangePickerFormValues>({
    defaultValues: {
      dateType: defaultDateType,
      fromDate: minDate,
      toDate: maxDate,
    },
  });

  if (formRef) {
    formRef.current = methods;
  }

  return (
    <FormProvider {...methods}>
      <DateRangePicker data-testid={testId} maxDate={maxDate} minDate={minDate} />
    </FormProvider>
  );
};

async function renderWithForm(
  defaultDateType: DateRangePickerType = DateRangePickerType.AllTime,
): Promise<UseFormReturn<DateRangePickerFormValues>> {
  const formRef: MutableRefObject<UseFormReturn<DateRangePickerFormValues> | null> = {
    current: null,
  };

  render(<DateRangePickerHarness formRef={formRef} defaultDateType={defaultDateType} />);

  await waitFor(() => expect(formRef.current).not.toBeNull());

  return formRef.current as UseFormReturn<DateRangePickerFormValues>;
}

async function selectDateRangeOption(dateType: DateRangePickerType) {
  const dateRangeSelect = screen.getByTestId(`${testId}-date-range-picker`);
  const combobox = dateRangeSelect.querySelector('[role="combobox"]');
  expect(combobox).toBeTruthy();
  fireEvent.mouseDown(combobox as Element);

  await waitFor(() => {
    expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
  });

  const targetOption = screen
    .getAllByRole('option')
    .find((option) => option.getAttribute('data-value') === dateType);

  expect(targetOption).toBeDefined();
  fireEvent.click(targetOption as Element);
}

async function openAndCloseDatePicker(pickerTestId: string) {
  const pickerInput = screen.getByTestId(pickerTestId).querySelector('input');
  expect(pickerInput).toBeTruthy();

  await userEvent.click(pickerInput as HTMLInputElement);

  await waitFor(() => {
    expect(screen.getByTestId(`${pickerTestId}-popover`)).toBeInTheDocument();
  });

  await userEvent.keyboard('{Escape}');
}

describe('DateRangePicker', () => {
  it('should render date range select', () => {
    render(<DateRangePickerHarness />);

    expect(screen.getByTestId(`${testId}-date-range-picker`)).toBeInTheDocument();
  });

  it('sets from/to for All time preset', async () => {
    const form = await renderWithForm(DateRangePickerType.Last24h);
    await selectDateRangeOption(DateRangePickerType.AllTime);

    await waitFor(() => {
      const { fromDate, toDate } = form.getValues();
      expect(fromDate).toEqual(startOfDay(minDate));
      expect(toDate).toEqual(endOfDay(maxDate));
    });
  });

  it('should show from and to date pickers when Custom Date (choose dates) is selected', async () => {
    render(<DateRangePickerHarness />);

    expect(screen.queryByTestId(`${testId}-from-date`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`${testId}-to-date`)).not.toBeInTheDocument();

    await selectDateRangeOption(DateRangePickerType.ChooseDates);

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-from-date`)).toBeVisible();
      expect(screen.getByTestId(`${testId}-to-date`)).toBeVisible();
    });
  });

  it('does not render from/to date pickers when dateType is AllTime', async () => {
    render(<DateRangePickerHarness />);
    await selectDateRangeOption(DateRangePickerType.AllTime);
    expect(screen.queryByTestId(`${testId}-from-date`)).not.toBeInTheDocument();
  });

  it('sets from/to values when dateType changes to Last24h', async () => {
    const form = await renderWithForm(DateRangePickerType.Last24h);

    await waitFor(() => {
      const { fromDate, toDate } = form.getValues();
      expect(fromDate).toEqual(addDays(maxDate, -1));
      expect(toDate).toEqual(maxDate);
    });
  });

  it('sets from/to values when dateType changes to LastWeek', async () => {
    const form = await renderWithForm(DateRangePickerType.Last24h);
    await selectDateRangeOption(DateRangePickerType.LastWeek);

    await waitFor(() => {
      const { fromDate, toDate } = form.getValues();
      expect(fromDate).toEqual(startOfDay(addDays(maxDate, -7)));
      expect(toDate).toEqual(endOfDay(maxDate));
    });
  });

  it('sets from/to values when dateType changes to LastMonth', async () => {
    const form = await renderWithForm(DateRangePickerType.Last24h);
    await selectDateRangeOption(DateRangePickerType.LastMonth);

    await waitFor(() => {
      const { fromDate, toDate } = form.getValues();
      expect(fromDate).toEqual(startOfDay(addDays(maxDate, -30)));
      expect(toDate).toEqual(endOfDay(maxDate));
    });
  });

  it('clamps/adjusts toDate when fromDate is set after toDate (on from picker close)', async () => {
    const form = await renderWithForm(DateRangePickerType.ChooseDates);

    const fromTestDate = new Date('2025-07-13T15:30:00.000Z');
    const toTestDate = new Date('2025-07-12T10:00:00.000Z'); // toDate < fromDate

    act(() => {
      form.setValue('fromDate', fromTestDate);
      form.setValue('toDate', toTestDate);
    });

    await openAndCloseDatePicker(`${testId}-from-date`);

    await waitFor(() => {
      const { toDate } = form.getValues();
      const expectedTo = endOfDay(addDays(fromTestDate, 1));
      expect(toDate).toEqual(expectedTo);
    });
  });

  it('unmounts from/to date pickers when switching away from ChooseDates', async () => {
    render(<DateRangePickerHarness />);

    await selectDateRangeOption(DateRangePickerType.ChooseDates);
    expect(screen.getByTestId(`${testId}-from-date`)).toBeVisible();
    expect(screen.getByTestId(`${testId}-to-date`)).toBeVisible();

    await selectDateRangeOption(DateRangePickerType.AllTime);

    await waitFor(() => {
      expect(screen.queryByTestId(`${testId}-from-date`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${testId}-to-date`)).not.toBeInTheDocument();
    });
  });

  it('keeps from/to within minDate/maxDate bounds', async () => {
    const form = await renderWithForm(DateRangePickerType.AllTime);
    await selectDateRangeOption(DateRangePickerType.ChooseDates);

    await waitFor(() => {
      const { fromDate, toDate } = form.getValues();
      expect(fromDate).toEqual(startOfDay(minDate));
      expect(toDate).toEqual(endOfDay(maxDate));
    });
  });

  it('clamps toDate to maxDate when fromDate is at maxDate boundary', async () => {
    const form = await renderWithForm(DateRangePickerType.ChooseDates);

    // Set fromDate to maxDate so addDays(fromDate, 1) exceeds maxDate
    act(() => {
      form.setValue('fromDate', maxDate);
      form.setValue('toDate', new Date('2025-07-10T10:00:00.000Z'));
    });

    await openAndCloseDatePicker(`${testId}-from-date`);

    await waitFor(() => {
      const { toDate } = form.getValues();
      expect(toDate).toEqual(endOfDay(maxDate));
    });
  });

  it('normalizes toDate to endOfDay when to date picker closes', async () => {
    const form = await renderWithForm(DateRangePickerType.ChooseDates);

    const midDayDate = new Date('2025-07-10T14:30:00.000Z');
    act(() => {
      form.setValue('toDate', midDayDate);
    });

    await openAndCloseDatePicker(`${testId}-to-date`);

    await waitFor(() => {
      const { toDate } = form.getValues();
      expect(toDate).toEqual(endOfDay(midDayDate));
    });
  });

  it('restricts to date picker minDate to current fromDate', async () => {
    const form = await renderWithForm(DateRangePickerType.ChooseDates);

    // Set fromDate to July 10 so days before July 10 should be disabled in the to picker
    act(() => {
      form.setValue('fromDate', new Date('2025-07-10T00:00:00.000Z'));
    });

    const toDateInput = screen.getByTestId(`${testId}-to-date`).querySelector('input');
    expect(toDateInput).toBeTruthy();

    await userEvent.click(toDateInput as HTMLInputElement);

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-to-date-popover`)).toBeInTheDocument();
    });

    const popover = screen.getByTestId(`${testId}-to-date-popover`);
    const disabledDays = popover.querySelectorAll('.react-datepicker__day--disabled');
    expect(disabledDays.length).toBeGreaterThan(0);

    // July 9 (before fromDate) should be disabled
    const day9 = popover.querySelector('.react-datepicker__day--009');
    expect(day9).toBeTruthy();
    expect((day9 as Element).classList.contains('react-datepicker__day--disabled')).toBe(true);

    // July 10 (fromDate itself) should not be disabled
    const day10 = popover.querySelector('.react-datepicker__day--010');
    expect(day10).toBeTruthy();
    expect((day10 as Element).classList.contains('react-datepicker__day--disabled')).toBe(false);
  });
});
