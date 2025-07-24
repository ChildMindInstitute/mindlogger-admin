import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, format } from 'date-fns';
import { FieldValues, FormProvider, useForm, UseFormReturn } from 'react-hook-form';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { DateFormats } from 'shared/consts';
import { mockedApplet, mockedAppletId } from 'shared/mock';
import { SettingParam } from 'shared/utils';
import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import {
  ExportDataExported,
  ExportDataFormValues,
  ExportDateType,
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

const mockDateString = '2025-07-107T12:30:45';
const mockDatePlus5Minutes = '2025-07-107T12:35:45';

const mockOnClose = jest.fn();
const mockOnExport = jest.fn();

type FormComponentProps = {
  children: React.ReactNode;
  getForm?: <T extends FieldValues>(form: UseFormReturn<T>) => void;
};

const FormComponent = ({ children, getForm }: FormComponentProps) => {
  const methods = useForm<ExportDataFormValues>({
    defaultValues: {
      dataExported: ExportDataExported.ResponsesOnly,
      dateType: ExportDateType.AllTime,
      fromDate: date,
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
  maxDate: new Date(),
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
      mockDate(mockDateString);

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
      mockDate(mockDatePlus5Minutes);

      await userEvent.click(downloadBtn);

      // The toDate should've been updated after the second click
      // Last24h's set should also contain the 5 mins afterwards,
      // the rest of the options should only contain endOfDay (23:59:59)
      const expectedSize = exportDataType === ExportDateType.Last24h ? 2 : 1;
      expect(toDates.size).toBe(expectedSize);
    });
  });

  describe('start/end of day processing', () => {
    let spy: jest.SpyInstance<Date>;
    let mockDate: (dateString: string) => void;

    beforeEach(() => {
      const origDateConstructor = global.Date;
      spy = jest.spyOn(global, 'Date');
      mockDate = (dateString) =>
        spy.mockImplementation((arg) => {
          if (arg !== undefined) {
            return new origDateConstructor(arg);
          }

          return new origDateConstructor(dateString);
        });
    });

    afterEach(() => {
      spy.mockRestore();
    });

    test.each`
      exportDataType                | description
      ${ExportDateType.AllTime}     | ${'all time'}
      ${ExportDateType.LastMonth}   | ${'last month'}
      ${ExportDateType.LastWeek}    | ${'last week'}
      ${ExportDateType.ChooseDates} | ${'choose dates'}
    `('initial normalization - $description', async () => {
      mockDate(mockDateString);

      const formValues: Set<string> = new Set();
      renderWithProviders(
        <FormComponent
          getForm={(form) => {
            const { fromDate, toDate } = form.getValues();
            formValues.add(`${fromDate.toString()}|${toDate.toString()}`);
          }}
        >
          <ExportSettingsPopup isOpen {...commonProps} />
        </FormComponent>,
        { preloadedState },
      );

      expect(formValues.size).toBeGreaterThanOrEqual(2);

      // Get the latest form values after date type change
      // Since we've already checked that the set has at least 2 values,
      // we can be sure that pop() will not return undefined
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [fromDateStr, toDateStr] = Array.from(formValues).pop()!.split('|');
      const fromDate = new Date(fromDateStr);
      const toDate = new Date(toDateStr);

      expect(fromDate.getHours()).toBe(0);
      expect(fromDate.getMinutes()).toBe(0);
      expect(fromDate.getSeconds()).toBe(0);
      expect(toDate.getHours()).toBe(23);
      expect(toDate.getMinutes()).toBe(59);
      expect(toDate.getSeconds()).toBe(59);
    });
  });

  it('should normalize choose dates after interaction', async () => {
    const formValues: Set<string> = new Set();
    let form: any;
    renderWithProviders(
      <FormComponent
        getForm={(formInstance) => {
          form = formInstance;
          const { fromDate, toDate } = form.getValues();
          formValues.add(
            `${fromDate.toISOString().split('Z')[0]}|${toDate.toISOString().split('Z')[0]}`,
          );
        }}
      >
        <ExportSettingsPopup isOpen {...commonProps} />
      </FormComponent>,
      { preloadedState },
    );

    // Switch to ChooseDates
    const dateTypeInput = screen
      .getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`)
      .querySelector('input');
    dateTypeInput &&
      fireEvent.change(dateTypeInput, { target: { value: ExportDateType.ChooseDates } });

    // Wait for the form to update after date type change
    await waitFor(() => {
      expect(dateTypeInput?.value).toBe(ExportDateType.ChooseDates);
    });

    // Clear previous values to focus on interaction changes
    formValues.clear();

    const testFromDate = new Date('2025-07-15T14:30:00');
    const testToDate = new Date('2025-07-20T16:45:00');

    // Manually set the dates (simulating what happens during date selection)
    act(() => {
      form.setValue('fromDate', testFromDate);
      form.setValue('toDate', testToDate);
    });

    // Trigger the normalization by simulating a popover close event
    const fromDateInput = screen
      .getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-from-date`)
      .querySelector('input');
    const toDateInput = screen
      .getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-to-date`)
      .querySelector('input');

    if (fromDateInput && toDateInput) {
      // Open and close the fromDate picker to trigger normalization
      await userEvent.click(fromDateInput);

      // Wait for popover to open
      await waitFor(() => {
        expect(
          screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-from-date-popover`),
        ).toBeInTheDocument();
      });

      // Close the popover by pressing Escape - this should trigger onCloseCallback
      await userEvent.keyboard('{Escape}');

      // Open and close the toDate picker to trigger normalization
      await userEvent.click(toDateInput);

      // Wait for popover to open
      await waitFor(() => {
        expect(
          screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-to-date-popover`),
        ).toBeInTheDocument();
      });

      // Close the popover by pressing Escape - this should trigger onCloseCallback
      await userEvent.keyboard('{Escape}');

      // Wait for normalization to complete
      await waitFor(() => {
        const values = form.getValues();
        expect(values.fromDate.getHours()).toBe(0);
        expect(values.toDate.getHours()).toBe(23);
      });
    }
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
