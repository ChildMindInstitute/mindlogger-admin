import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, format } from 'date-fns';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { vi } from 'vitest';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { DateFormats } from 'shared/consts';
import { mockedApplet, mockedAppletId } from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import { DateRangePickerType } from 'shared/components/DateRangePicker';

import {
  ExportDataExported,
  ExportDataFormValues,
  SupplementaryFiles,
} from '../../ExportDataSetting.types';
import { ExportSettingsPopup } from './ExportSettingsPopup';

const minDate = '2025-07-01T08:00:00.000000';
const date = new Date(minDate);

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: minDate } },
    },
  },
};

const mockOnClose = vi.fn();
const mockOnExport = vi.fn();

type FormComponentProps = {
  children: React.ReactNode;
  formRef?: React.MutableRefObject<UseFormReturn<ExportDataFormValues> | null>;
};

const FormComponent = ({ children, formRef }: FormComponentProps) => {
  const methods = useForm<ExportDataFormValues>({
    defaultValues: {
      dataExported: ExportDataExported.ResponsesOnly,
      dateType: DateRangePickerType.AllTime,
      fromDate: date,
      toDate: new Date(),
      supplementaryFiles: SupplementaryFiles.reduce(
        (acc, fileType) => ({ ...acc, [fileType]: false }),
        {} as Record<SupplementaryFiles, boolean>,
      ),
    },
    mode: 'onSubmit',
  });

  // Use ref instead of callback to avoid state updates during render
  if (formRef) {
    formRef.current = methods;
  }

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const commonProps = {
  onClose: mockOnClose,
  onExport: mockOnExport,
  minDate: date,
  maxDate: new Date(),
  contextItemName: mockedApplet.displayName,
  'data-testid': DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP,
};

describe('ExportSettingsPopup', () => {
  it('should appear if isOpen is true', async () => {
    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen {...commonProps} />
      </FormComponent>,
      {
        preloadedState,
      },
    );

    await waitFor(() =>
      expect(screen.getByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeVisible(),
    );
  });

  it('should not appear if isOpen is false', async () => {
    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen={false} {...commonProps} />
      </FormComponent>,
      {
        preloadedState,
      },
    );

    expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).not.toBeInTheDocument();
  });

  it('should trigger onExport if download button is clicked', async () => {
    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen {...commonProps} />
      </FormComponent>,
      {
        preloadedState,
      },
    );

    await userEvent.click(screen.getByText('Download'));

    expect(mockOnExport).toBeCalled();
  });

  describe('should appear export data popup for date range', () => {
    test.each`
      exportDataType              | description
      ${DateRangePickerType.Last24h}   | ${'last 24h'}
      ${DateRangePickerType.LastMonth} | ${'last month'}
      ${DateRangePickerType.LastWeek}  | ${'last week'}
      ${DateRangePickerType.AllTime}   | ${'all time'}
    `('$description', async ({ exportDataType }) => {
      renderWithProviders(
        <FormComponent>
          <ExportSettingsPopup isOpen {...commonProps} />
        </FormComponent>,
        {
          preloadedState,
        },
      );
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-date-range-picker`);
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportDataType } });

      await userEvent.click(screen.getByText('Download'));
      expect(mockOnExport).toBeCalled();
    });
  });

  // Date preset value tests (toDate per preset), start/end-of-day normalization tests,
  // and choose-dates picker interaction tests were removed because the date range logic
  // now lives in the shared DateRangePicker component and is covered by
  // DateRangePicker.test.tsx.

  describe("should appear export data popup for 'choose dates' date range", () => {
    test.each`
      route                                                                 | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.ExportData}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.ExportData}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      await act(async () => {
        renderWithProviders(
          <FormComponent>
            <ExportSettingsPopup isOpen {...commonProps} />
          </FormComponent>,
          { preloadedState, route, routePath },
        );
      });
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-date-range-picker`);
      expect(dateType).toBeVisible();
      expect(screen.getByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeVisible();

      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: DateRangePickerType.ChooseDates } });

      const fromDate = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-from-date`);
      const fromDateInput = fromDate.querySelector('input');
      const toDate = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-to-date`);
      const toDateInput = toDate.querySelector('input');
      expect(fromDate).toBeVisible();
      expect(fromDateInput?.value).toBe('01 Jul 2025');
      expect(toDate).toBeVisible();
      expect(toDateInput?.value).toBe(format(new Date(), DateFormats.DayMonthYear));

      fromDateInput && fireEvent.change(fromDateInput, { target: { value: addDays(date, 1) } });
      toDateInput && fireEvent.change(toDateInput, { target: { value: addDays(date, -1) } });

      await userEvent.click(screen.getByText('Download'));
      expect(mockOnExport).toBeCalled();
    });
  });
});
