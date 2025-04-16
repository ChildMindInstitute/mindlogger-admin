import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ImportSchedulePopup } from './ImportSchedulePopup';
import * as importSchedulePopupFunc from './ImportSchedulePopup.utils';

describe('ImportSchedulePopup', () => {
  const mockedOnClose = vi.fn();
  const mockedOnDownloadTemplate = vi.fn();
  const props = {
    isIndividual: false,
    appletName: 'applet',
    respondentName: 'respondent',
    open: true,
    onClose: mockedOnClose,
    onDownloadTemplate: mockedOnDownloadTemplate,
    scheduleExportData: [],
    'data-testid': 'modalDataTestId',
  };
  const contentArray = [
    'activityName,date,startTime,endTime,notificationTime,frequency',
    'New Activity#1,15 Feb 2024,-,-,-,Always',
  ];
  const file = new File([contentArray.join('\n')], 'test.csv', {
    type: 'text/csv',
  });

  // Here we test high-level logic of the stepper, not the internal conditions of the hook logic.
  // Need to mock the schedule export data to pass successfully when file is ready
  vi.spyOn(importSchedulePopupFunc, 'getUploadedScheduleErrors').mockImplementation(() => ({
    notExistentActivities: [],
    invalidStartTimeField: { data: null, id: 'invalid-start-time' },
    invalidEndTimeField: { data: null, id: 'invalid-end-time' },
    invalidNotification: { data: null, id: 'invalid-notification' },
    invalidFrequency: { data: null, id: 'invalid-frequency' },
    invalidDate: { data: null, id: 'invalid-date' },
    invalidStartEndTime: { data: null, id: 'invalid-start-end-time' },
    invalidNotificationTime: { data: null, id: 'invalid-notification-time' },
    hasInvalidData: false,
  }));

  afterAll(() => {
    jest.resetAllMocks();
    vi.restoreAllMocks();
  });

  test('should render default schedule step=0', () => {
    renderWithProviders(<ImportSchedulePopup {...props} />);

    expect(screen.getByTestId('modalDataTestId-title').textContent).toBe('Import Default Schedule');
    expect(
      screen.getByText(
        'Importing a new default schedule will replace the current default schedule. Are you sure you want to continue?',
      ),
    ).toBeInTheDocument();
    const secondaryBtn = screen.getByTestId('modalDataTestId-secondary-button');
    expect(secondaryBtn.textContent).toBe('Cancel');
    expect(secondaryBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    expect(submitBtn.textContent).toBe('Continue');
    expect(submitBtn.classList.contains('MuiButton-containedError')).toBeTruthy();
  });

  test('should render default schedule step=1', async () => {
    renderWithProviders(<ImportSchedulePopup {...props} />);

    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    await userEvent.click(submitBtn);

    expect(
      screen.getByText('Please upload a schedule in one of the following formats:'),
    ).toBeInTheDocument();
    const downloadBtn = screen.getByTestId('download-template');
    expect(downloadBtn.textContent).toBe('Download Template');
    expect(downloadBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    expect(submitBtn.textContent).toBe('Import');
    expect(submitBtn.classList.contains('MuiButton-containedPrimary')).toBeTruthy();
  });

  test('should render default schedule step=2', async () => {
    renderWithProviders(<ImportSchedulePopup {...props} />);

    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    await userEvent.click(submitBtn);

    const input = screen.getByTestId('upload-file-input');
    await userEvent.upload(input, file);
    expect(await screen.findByText('test.csv')).toBeInTheDocument();
    await userEvent.click(submitBtn);

    expect(
      screen.getByText(/^Are you sure you want to update the default schedule for Applet/),
    ).toBeInTheDocument();
    const secondaryBtn = screen.getByTestId('modalDataTestId-secondary-button');
    expect(secondaryBtn.textContent).toBe('Cancel');
    expect(secondaryBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    expect(submitBtn.textContent).toBe('Update Schedule');
    expect(submitBtn.classList.contains('MuiButton-containedError')).toBeTruthy();
  });

  test('should render individual schedule step=0', () => {
    renderWithProviders(
      <ImportSchedulePopup
        {...{
          ...props,
          isIndividual: true,
        }}
      />,
    );

    expect(screen.getByTestId('modalDataTestId-title').textContent).toBe(
      'Import Individual Schedule',
    );
    expect(
      screen.getByText(/^Importing a new individual schedule for respondent/),
    ).toBeInTheDocument();
    const secondaryBtn = screen.getByTestId('modalDataTestId-secondary-button');
    expect(secondaryBtn.textContent).toBe('Cancel');
    expect(secondaryBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    expect(submitBtn.textContent).toBe('Continue');
    expect(submitBtn.classList.contains('MuiButton-containedPrimary')).toBeTruthy();
  });

  test('should render individual schedule step=1', async () => {
    renderWithProviders(
      <ImportSchedulePopup
        {...{
          ...props,
          isIndividual: true,
        }}
      />,
    );

    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    await userEvent.click(submitBtn);

    expect(
      screen.getByText('Please upload a schedule in one of the following formats:'),
    ).toBeInTheDocument();
    const downloadBtn = screen.getByTestId('download-template');
    expect(downloadBtn.textContent).toBe('Download Template');
    expect(downloadBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    expect(submitBtn.textContent).toBe('Import');
    expect(submitBtn.classList.contains('MuiButton-containedPrimary')).toBeTruthy();
  });

  test('should render individual schedule step=2', async () => {
    renderWithProviders(
      <ImportSchedulePopup
        {...{
          ...props,
          isIndividual: true,
        }}
      />,
    );

    const submitBtn = screen.getByTestId('modalDataTestId-submit-button');
    await userEvent.click(submitBtn);

    const input = screen.getByTestId('upload-file-input');
    await userEvent.upload(input, file);
    expect(await screen.findByText('test.csv')).toBeInTheDocument();
    await userEvent.click(submitBtn);

    expect(
      screen.getByText(/^Are you sure you want to update the individual schedule for respondent/),
    ).toBeInTheDocument();
    const secondaryBtn = screen.getByTestId('modalDataTestId-secondary-button');
    expect(secondaryBtn.textContent).toBe('Cancel');
    expect(secondaryBtn.classList.contains('MuiButton-textPrimary')).toBeTruthy();
    expect(submitBtn.textContent).toBe('Update Schedule');
    expect(submitBtn.classList.contains('MuiButton-containedError')).toBeTruthy();
  });
});
