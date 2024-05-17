// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormProvider, useForm } from 'react-hook-form';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';
import * as reactHookForm from 'react-hook-form';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { page } from 'resources';
import { mockedAppletId, mockedRespondentId } from 'shared/mock';
import { MAX_LIMIT } from 'shared/consts';
import { RespondentsDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.types';
import { defaultRespondentDataFormValues } from 'modules/Dashboard/features/RespondentData/RespondentData.const';

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
const route = `/dashboard/${mockedAppletId}/respondents/${mockedRespondentId}/dataviz/summary`;
const routePath = page.appletRespondentDataSummary;
const mockedActivity = {
  id: 'd65e8a64-a023-4830-9c84-7433c4b96440',
  name: 'Activity 1',
  isPerformanceTask: false,
  hasAnswer: true,
  isFlow: false,
};

const mockedFlow = {
  id: 'flow-id',
  name: 'Flow 1',
  hasAnswer: true,
  isFlow: true,
};

const FormComponent = () => {
  const methods = useForm<RespondentsDataFormValues>({
    defaultValues: {
      ...defaultRespondentDataFormValues,
      startDate: new Date('2024-01-04'),
      endDate: new Date('2024-01-10'),
      versions: [
        { label: '1.0.0', id: '1.0.0' },
        { label: '1.0.1', id: '1.0.1' },
      ],
    },
  });

  return (
    <FormProvider {...methods}>
      <ReportFilters identifiers={identifiers} versions={versions} setIsLoading={jest.fn()} />
    </FormProvider>
  );
};

const mockedUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockedUseParams(),
}));

describe('ReportFilters', () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ appletId: mockedAppletId, respondentId: mockedRespondentId });
  });

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
      renderWithProviders(<FormComponent />);
    });

    const startDatePicker = screen.getByTestId(`${dataTestid}-start-date`);
    const endDatePicker = screen.getByTestId(`${dataTestid}-end-date`);

    const startInput = startDatePicker.querySelector('input');
    expect(startInput).toBeInTheDocument();
    expect(startInput.value).toEqual('04 Jan 2024');

    const endInput = endDatePicker.querySelector('input');
    expect(endInput).toBeInTheDocument();
    expect(endInput.value).toEqual('10 Jan 2024');

    await act(async () => {
      await userEvent.click(startInput);
    });

    const datepicker = await screen.findByTestId(`${dataTestid}-start-date-popover`);
    expect(datepicker).toBeInTheDocument();

    const january11 = datepicker.getElementsByClassName(
      'react-datepicker__day react-datepicker__day--011',
    );
    expect(january11).toHaveLength(1);

    await userEvent.click(january11[0]);

    const okButton = screen.getByText('Ok', { container: datepicker });
    await userEvent.click(okButton);

    expect(startInput.value).toEqual('11 Jan 2024');
    expect(endInput.value).toEqual('12 Jan 2024');
  });

  test('fetch answers on filters change', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: [
          {
            userPublicKey: 'userPublicKey',
            answer: 'answer',
            items: [],
            itemIds: 'itemIds',
          },
        ],
      },
    });
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([
        true,
        false,
        new Date('2024-01-04'),
        new Date('2024-01-10'),
        mockedActivity,
      ]);

    await act(async () => {
      renderWithProviders(<FormComponent />, route, routePath);
    });

    await userEvent.click(screen.getByTestId(`${dataTestid}-filter-by-identifier`));

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/activities/${mockedActivity.id}/answers`,
        {
          params: {
            emptyIdentifiers: false,
            fromDatetime: '2024-01-04T00:00:00',
            identifiers: '',
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-10T23:59:00',
            versions: '1.0.0,1.0.1',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });
  });

  test('fetch answers on filters change when the entity is Flow', async () => {
    jest
      .spyOn(reactHookForm, 'useWatch')
      .mockReturnValue([true, false, new Date('2024-01-04'), new Date('2024-01-10'), mockedFlow]);

    renderWithProviders(<FormComponent />, route, routePath);

    await userEvent.click(screen.getByTestId(`${dataTestid}-filter-by-identifier`));

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(
        1,
        `/answers/applet/${mockedAppletId}/flows/${mockedFlow.id}/submissions`,
        {
          params: {
            emptyIdentifiers: false,
            fromDatetime: '2024-01-04T00:00:00',
            identifiers: '',
            respondentId: mockedRespondentId,
            toDatetime: '2024-01-10T23:59:00',
            versions: '1.0.0,1.0.1',
            limit: MAX_LIMIT,
          },
          signal: undefined,
        },
      );
    });
  });
});
