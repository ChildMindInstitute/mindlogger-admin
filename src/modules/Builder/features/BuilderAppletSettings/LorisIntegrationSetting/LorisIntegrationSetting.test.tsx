// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { useIsServerConfigured, useFeatureFlags } from 'shared/hooks';
import { page } from 'resources';

import { LorisIntegrationSetting } from './LorisIntegrationSetting';

jest.mock('shared/hooks', () => ({
  ...jest.requireActual('shared/hooks'),
  useIsServerConfigured: jest.fn(),
  useFeatureFlags: jest.fn(),
}));

const LorisIntegrationSettingWrapper = ({ defaultValues }) => {
  const methods = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <LorisIntegrationSetting />
    </FormProvider>
  );
};

describe('LorisIntegrationSetting', () => {
  test("server is not configured, lorisIntegration by default is false, integrations = ['loris']", async () => {
    (useIsServerConfigured as jest.Mock).mockReturnValue(false);
    (useFeatureFlags as jest.Mock).mockReturnValue({
      featureFlags: {
        enableLorisIntegration: false,
      },
    });
    renderWithProviders(
      <LorisIntegrationSettingWrapper
        defaultValues={{
          lorisIntegration: false,
          integrations: ['loris'],
        }}
      />,
    );

    const checkboxContainer = screen.getByTestId(
      'applet-settings-loris-integration-checkbox',
    ) as HTMLInputElement;
    expect(checkboxContainer).toBeInTheDocument();
    expect(checkboxContainer).toHaveClass('Mui-disabled');

    const uploadButton = screen.getByTestId('applet-settings-loris-integration-upload');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();
  });

  test('server is configured, lorisIntegration by default is false, integrations = []', async () => {
    (useIsServerConfigured as jest.Mock).mockReturnValue(true);
    (useFeatureFlags as jest.Mock).mockReturnValue({
      featureFlags: {
        enableLorisIntegration: false,
      },
    });
    renderWithProviders(
      <LorisIntegrationSettingWrapper
        defaultValues={{
          lorisIntegration: false,
          integrations: [],
        }}
      />,
    );
    const descriptionText =
      'Enabling the activation of data collection will subsequently provide you with the option to initiate the upload of data from completed Activities by consented respondents into LORIS for utilization and contextualization. Please note that only Respondents who have agreed to make their responses public will have access to complete the Activities in this Applet.';
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
    const checkboxContainer = screen.getByTestId(
      'applet-settings-loris-integration-checkbox',
    ) as HTMLInputElement;
    expect(checkboxContainer).toBeInTheDocument();

    await userEvent.click(checkboxContainer);

    expect(checkboxContainer.firstChild).toHaveClass('Mui-checked');
    const checkboxLabel = screen.getByText('Activate data collection');
    expect(checkboxLabel).toBeInTheDocument();
    const uploadButton = screen.getByTestId('applet-settings-loris-integration-upload');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();
  });

  test("server is configured, lorisIntegration by default is false, integrations = ['loris']", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { result: ['V1', 'V2', 'V3', 'V4', 'V5'] } });
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          user_id_1: [
            {
              activityName: 'Activity 2',
              completedDate: '2023-02-03T06:32:55.930074',
              secretUserId: 'jane doe',
            },
          ],
          user_id_2: [
            {
              activityName: 'Activity 4',
              completedDate: '2023-02-03T06:32:55.930074',
              secretUserId: 'sam winchester',
              visit: 'V1',
            },
          ],
        },
      },
    });
    mockAxios.post.mockResolvedValueOnce({ data: {} });

    (useIsServerConfigured as jest.Mock).mockReturnValue(true);
    (useFeatureFlags as jest.Mock).mockReturnValue({
      featureFlags: {
        enableLorisIntegration: false,
      },
    });
    renderWithProviders(
      <LorisIntegrationSettingWrapper
        defaultValues={{
          lorisIntegration: false,
          integrations: ['loris'],
        }}
      />,
      {
        route: `/builder/123/settings/loris-integration`,
        routePath: page.builderAppletSettingsItem,
      },
    );

    const uploadButton = screen.getByTestId('applet-settings-loris-integration-upload');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();

    const checkboxContainer = screen.getByTestId(
      'applet-settings-loris-integration-checkbox',
    ) as HTMLInputElement;
    expect(checkboxContainer).toBeInTheDocument();

    await userEvent.click(checkboxContainer);

    expect(checkboxContainer.firstChild).toHaveClass('Mui-checked');
    const checkboxLabel = screen.getByText('Activate data collection');
    expect(checkboxLabel).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();
  });

  test("server is configured, lorisIntegration by default is true, integrations = ['loris']", async () => {
    mockAxios.get.mockResolvedValueOnce({ data: { result: ['V1', 'V2', 'V3', 'V4', 'V5'] } });
    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: {
          user_id_1: [
            {
              activityName: 'Activity 2',
              completedDate: '2023-02-03T06:32:55.930074',
              secretUserId: 'jane doe',
            },
          ],
          user_id_2: [
            {
              activityName: 'Activity 4',
              completedDate: '2023-02-03T06:32:55.930074',
              secretUserId: 'sam winchester',
              visit: 'V1',
            },
          ],
        },
      },
    });
    mockAxios.post.mockResolvedValueOnce({ data: {} });

    (useIsServerConfigured as jest.Mock).mockReturnValue(true);
    (useFeatureFlags as jest.Mock).mockReturnValue({
      featureFlags: {
        enableLorisIntegration: true,
      },
    });
    renderWithProviders(
      <LorisIntegrationSettingWrapper
        defaultValues={{
          lorisIntegration: false,
          integrations: ['loris'],
        }}
      />,
      {
        route: `/builder/123/settings/loris-integration`,
        routePath: page.builderAppletSettingsItem,
      },
    );

    const uploadButton = screen.getByTestId('applet-settings-loris-integration-upload');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled();

    const checkboxContainer = screen.getByTestId(
      'applet-settings-loris-integration-checkbox',
    ) as HTMLInputElement;
    expect(checkboxContainer).toBeInTheDocument();

    await userEvent.click(checkboxContainer);

    expect(checkboxContainer.firstChild).toHaveClass('Mui-checked');
    const checkboxLabel = screen.getByText('Activate data collection');
    expect(checkboxLabel).toBeInTheDocument();
    expect(uploadButton).not.toBeDisabled();

    await userEvent.click(uploadButton);

    const uploadPopup = screen.getByTestId('applet-settings-loris-integration-popup');
    expect(uploadPopup).toBeInTheDocument();

    const acceptAgreementButton = screen.getByTestId(
      'applet-settings-loris-integration-popup-submit-button',
    );
    expect(acceptAgreementButton).toBeInTheDocument();
    await userEvent.click(acceptAgreementButton);

    expect(mockAxios.get).toBeCalledWith('/integrations/loris/visits', { signal: undefined });
    expect(mockAxios.get).toBeCalledWith('/integrations/loris/users/visits', { signal: undefined });

    const lorisVisits = screen.getByTestId('loris-visits');
    expect(lorisVisits).toBeInTheDocument();

    expect(
      screen.getByText('Please check if predefined Visit values are correct:'),
    ).toBeInTheDocument();

    expect(lorisVisits.querySelectorAll('th')).toHaveLength(4);
    expect(lorisVisits.querySelectorAll('tbody tr')).toHaveLength(2);

    // change visit value for the first row
    const firstRow = lorisVisits.querySelectorAll('tbody tr')[0] as HTMLElement;
    const selectContainer = within(firstRow).getByTestId('loris-visits-select-0');
    expect(selectContainer).toBeInTheDocument();
    const select = selectContainer.querySelector('.MuiSelect-select') as Element;
    await userEvent.click(select);

    const dropdown = screen.getByTestId('loris-visits-select-0-dropdown');
    expect(dropdown.querySelectorAll('li')).toHaveLength(5); // 5 mocked visits
    await userEvent.click(dropdown.querySelectorAll('li')[3]);

    const submitButton = screen.getByTestId(
      'applet-settings-loris-integration-popup-submit-button',
    );
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);

    expect(mockAxios.post).toBeCalledWith(
      '/integrations/loris/publish',
      {
        user_id_1: [
          {
            activityName: 'Activity 2',
            completedDate: '2023-02-03T06:32:55.930074',
            secretUserId: 'jane doe',
            visit: 'V4',
          },
        ],
        user_id_2: [
          {
            activityName: 'Activity 4',
            completedDate: '2023-02-03T06:32:55.930074',
            secretUserId: 'sam winchester',
            visit: 'V1',
          },
        ],
      },
      { signal: undefined },
    );

    expect(
      screen.getByText('If any new data has been collected, it has been uploaded successfully.'),
    ).toBeInTheDocument();
    const okButton = screen.getByRole('button', { name: 'Ok' });
    expect(okButton).toBeInTheDocument();
    await userEvent.click(okButton);

    expect(screen.queryByTestId('applet-settings-loris-integration-popup')).not.toBeInTheDocument();
  });
});
