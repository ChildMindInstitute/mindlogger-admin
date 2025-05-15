import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, format } from 'date-fns';
import { FieldValues, FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { DateFormats } from 'shared/consts';
import { mockedAppletId, mockedApplet } from 'shared/mock';
import { SettingParam, getNormalizedTimezoneDate } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ExportSettingsPopup } from './ExportSettingsPopup';
import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import {
  ExportDataFormValues,
  ExportDateType,
  SupplementaryFiles,
} from '../../ExportDataSetting.types';

const dateString = '2023-11-14T14:43:33.369902';
const date = new Date(dateString);

const preloadedState = {
  applet: {
    applet: {
      ...initialStateData,
      data: { result: { ...mockedApplet, createdAt: dateString } },
    },
  },
};

const mockOnClose = jest.fn();
const mockOnExport = jest.fn();

type FormComponentProps = {
  children: React.ReactNode;
  getForm?: <T extends FieldValues>(form: UseFormReturn<T>) => void;
};

const FormComponent = ({ children, getForm }: FormComponentProps) => {
  const methods = useForm<ExportDataFormValues>({
    defaultValues: {
      dateType: ExportDateType.AllTime,
      fromDate: new Date(),
      toDate: new Date(),
      supplementaryFiles: SupplementaryFiles.reduce(
        (acc, fileType) => ({ ...acc, [fileType]: false }),
        {} as Record<SupplementaryFiles, boolean>,
      ),
    },
    mode: 'onSubmit',
  });

  getForm?.(methods);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const commonProps = {
  onClose: mockOnClose,
  onExport: mockOnExport,
  minDate: date,
  getMaxDate: () => getNormalizedTimezoneDate(new Date().toString()),
  appletName: mockedApplet.displayName,
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
      ${ExportDateType.Last24h}   | ${'last 24h'}
      ${ExportDateType.LastMonth} | ${'last month'}
      ${ExportDateType.LastWeek}  | ${'last week'}
      ${ExportDateType.AllTime}   | ${'all time'}
    `('$description', async ({ exportDataType }) => {
      renderWithProviders(
        <FormComponent>
          <ExportSettingsPopup isOpen {...commonProps} />
        </FormComponent>,
        {
          preloadedState,
        },
      );
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`);
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportDataType } });

      await userEvent.click(screen.getByText('Download'));
      expect(mockOnExport).toBeCalled();
    });
  });

  describe('should update the toDate for every date range export', () => {
    let spy: jest.SpyInstance<Date>;
    let mockDate: (dateString: string) => void;

    beforeEach(() => {
      const origDateConstructor = global.Date;
      spy = jest.spyOn(global, 'Date');
      mockDate = (dateString) => spy.mockImplementation(() => new origDateConstructor(dateString));
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test.each`
      exportDataType              | description
      ${ExportDateType.Last24h}   | ${'last 24h'}
      ${ExportDateType.LastMonth} | ${'last month'}
      ${ExportDateType.LastWeek}  | ${'last week'}
      ${ExportDateType.AllTime}   | ${'all time'}
    `('$description', async ({ exportDataType }) => {
      mockDate('2024-05-07T00:00:00Z');

      const toDates: Set<string> = new Set();
      renderWithProviders(
        <FormComponent
          getForm={(form) => {
            const date = form.getValues().toDate.toString();
            toDates.add(date);
          }}
        >
          <ExportSettingsPopup isOpen {...commonProps} />
        </FormComponent>,
        {
          preloadedState,
        },
      );
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`);
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportDataType } });

      const downloadBtn = screen.getByText('Download');

      await userEvent.click(downloadBtn);

      // 5 minutes later
      mockDate('2024-05-07T00:05:00Z');

      await userEvent.click(downloadBtn);

      // The toDate should've been updated after the second click
      expect(toDates.size).toEqual(2);
    });
  });

  describe("should appear export data popup for 'choose dates' date range", () => {
    test.each`
      route                                                                 | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.ExportData}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.ExportData}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      renderWithProviders(
        <FormComponent>
          <ExportSettingsPopup isOpen {...commonProps} />
        </FormComponent>,
        { preloadedState, route, routePath },
      );
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`);
      expect(dateType).toBeVisible();
      expect(screen.getByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).toBeVisible();

      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: ExportDateType.ChooseDates } });

      const fromDate = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-from-date`);
      const fromDateInput = fromDate.querySelector('input');
      const toDate = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-to-date`);
      const toDateInput = toDate.querySelector('input');
      expect(fromDate).toBeVisible();
      expect(fromDateInput?.value).toBe('14 Nov 2023');
      expect(toDate).toBeVisible();
      expect(toDateInput?.value).toBe(format(new Date(), DateFormats.DayMonthYear));

      fromDateInput && fireEvent.change(fromDateInput, { target: { value: addDays(date, 1) } });
      toDateInput && fireEvent.change(toDateInput, { target: { value: addDays(date, -1) } });

      await userEvent.click(screen.getByText('Download'));
      expect(mockOnExport).toBeCalled();
    });
  });
});
