// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Suspense } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';
import { SummaryFiltersForm } from 'modules/Dashboard/pages/RespondentData/RespondentData.types';
import { defaultSummaryFormFiltersValues } from 'modules/Dashboard/pages/RespondentData/RespondentData.const';

import { ReportFilters } from './ReportFilters';

const identifiers = [
  {
    encryptedValue: 'encryptedValue',
    decryptedValue: 'Jane Doe',
  },
];

const versions = [
  {
    version: '1.0.1',
  },
  {
    version: '1.1.0',
  },
];

const dataTestid = 'respondents-summary-filters';

const FormComponent = () => {
  const methods = useForm<SummaryFiltersForm>({
    defaultValues: {
      ...defaultSummaryFormFiltersValues,
      startDate: new Date('2024-01-04'),
      endDate: new Date('2024-01-10'),
    },
  });

  return (
    <FormProvider {...methods}>
      <ReportFilters identifiers={identifiers} versions={versions} />
    </FormProvider>
  );
};

describe('ReportFilters', () => {
  test('renders date pickers and time pickers', async () => {
    await act(async () => {
      renderWithProviders(<FormComponent />);
    });

    const startDatePicker = screen.getByTestId(`${dataTestid}-start-date`);
    const endDatePicker = screen.getByTestId(`${dataTestid}-end-date`);
    const startTimePicker = screen.getByTestId(`${dataTestid}-start-time`);
    const endTimePicker = screen.getByTestId(`${dataTestid}-end-time`);

    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
    expect(startTimePicker).toBeInTheDocument();
    expect(endTimePicker).toBeInTheDocument();
  });

  test('toggles more filters visibility on click', async () => {
    await act(async () => {
      renderWithProviders(<FormComponent />);
    });

    expect(screen.queryByTestId(`${dataTestid}-more`)).not.toBeInTheDocument();

    const moreFiltersButton = screen.getByTestId(`${dataTestid}-more-button`);
    await userEvent.click(moreFiltersButton);

    expect(screen.getByTestId(`${dataTestid}-more`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-filter-by-identifier`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-respondent-identifier`)).toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestid}-versions`)).toBeInTheDocument();
  });

  test('check if the startDate is greater than the endDate, then the endDate should be updated', async () => {
    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<></>}>
          <FormComponent />
        </Suspense>,
      );
    });

    const startDatePicker = screen.getByTestId(`${dataTestid}-start-date`);
    const endDatePicker = screen.getByTestId(`${dataTestid}-end-date`);

    const startInput = startDatePicker.querySelector('input');
    expect(startInput).toBeInTheDocument();
    expect(startInput.value).toEqual('04 Jan 2024');

    const endInput = endDatePicker.querySelector('input');
    expect(endInput).toBeInTheDocument();
    expect(endInput.value).toEqual('10 Jan 2024');

    userEvent.click(startInput);

    const datepicker = await screen.findByTestId(`${dataTestid}-start-date-popover`);
    expect(datepicker).toBeInTheDocument();

    const january11 = datepicker.getElementsByClassName(
      'react-datepicker__day react-datepicker__day--011',
    );
    expect(january11).toHaveLength(1);

    userEvent.click(january11[0]);

    const okButton = screen.getByText('Ok', { container: datepicker });
    await userEvent.click(okButton);

    expect(startInput.value).toEqual('11 Jan 2024');
    expect(endInput.value).toEqual('12 Jan 2024');
  });
});
