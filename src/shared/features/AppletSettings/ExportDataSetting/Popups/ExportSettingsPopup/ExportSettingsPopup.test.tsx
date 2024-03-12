import { fireEvent, screen, waitFor } from '@testing-library/react';
import { addDays, format } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';

import { initialStateData } from 'redux/modules';
import { page } from 'resources';
import { DateFormats } from 'shared/consts';
import { mockedAppletId, mockedApplet } from 'shared/mock';
import { SettingParam, renderWithProviders } from 'shared/utils';

import { ExportSettingsPopup } from './ExportSettingsPopup';
import { DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP } from '../../ExportDataSetting.const';
import { ExportDataFormValues, ExportDateType } from '../../ExportDataSetting.types';

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

const FormComponent = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<ExportDataFormValues>({
    defaultValues: {
      dateType: ExportDateType.AllTime,
      fromDate: new Date(),
      toDate: new Date(),
    },
    mode: 'onSubmit',
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ExportSettingsPopup', () => {
  it('should appear if isOpen is true', async () => {
    const mockOnExport = jest.fn();

    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen onClose={mockOnClose} onExport={mockOnExport} />
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
    const mockOnExport = jest.fn();

    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen={false} onClose={mockOnClose} onExport={mockOnExport} />
      </FormComponent>,
      {
        preloadedState,
      },
    );

    expect(screen.queryByTestId(DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP)).not.toBeInTheDocument();
  });

  it('should trigger onExport if download button is clicked', async () => {
    const mockOnExport = jest.fn();

    renderWithProviders(
      <FormComponent>
        <ExportSettingsPopup isOpen onClose={mockOnClose} onExport={mockOnExport} />
      </FormComponent>,
      {
        preloadedState,
      },
    );

    fireEvent.click(screen.getByText('Download CSV'));

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
      const mockOnExport = jest.fn();

      renderWithProviders(
        <FormComponent>
          <ExportSettingsPopup isOpen onClose={mockOnClose} onExport={mockOnExport} />
        </FormComponent>,
        {
          preloadedState,
        },
      );
      const dateType = screen.getByTestId(`${DATA_TESTID_EXPORT_DATA_SETTINGS_POPUP}-dateType`);
      const input = dateType.querySelector('input');
      input && fireEvent.change(input, { target: { value: exportDataType } });

      fireEvent.click(screen.getByText('Download CSV'));
      expect(mockOnExport).toBeCalled();
    });
  });

  describe("should appear export data popup for 'choose dates' date range", () => {
    test.each`
      route                                                                 | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.ExportData}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.ExportData}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      const mockOnExport = jest.fn();

      renderWithProviders(
        <FormComponent>
          <ExportSettingsPopup isOpen onClose={mockOnClose} onExport={mockOnExport} />
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

      fireEvent.click(screen.getByText('Download CSV'));
      expect(mockOnExport).toBeCalled();
    });
  });
});
