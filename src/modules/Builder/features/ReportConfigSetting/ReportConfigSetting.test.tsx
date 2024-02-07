// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createRef } from 'react';
import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import * as reportApi from 'modules/Dashboard/api/api';
import { page } from 'resources';
import { applet } from 'redux/modules';
import { mockedAppletData, mockedPassword } from 'shared/mock';
import { SettingParam, renderWithAppletFormData, renderWithProviders } from 'shared/utils';
import * as encryptionUtils from 'shared/utils/encryption';

import { ReportConfigSetting } from './ReportConfigSetting';
import * as reportUtils from './ReportConfigSetting.utils';

const mockedReportConfigDataTestid = 'report-config';
const renderReportConfigSetting = () => {
  renderWithProviders(
    <ReportConfigSetting onSubmitSuccess={() => {}} data-testid={mockedReportConfigDataTestid} />,
    {
      routePath: page.builderAppletSettingsItem,
      route: generatePath(page.builderAppletSettingsItem, {
        appletId: mockedAppletData.id,
        setting: SettingParam.ReportConfiguration,
      }),
    },
  );
};
const renderReportConfigSettingWithForm = ({
  isActivity,
  isActivityFlow,
  isServerConfigured,
} = {}) => {
  const ref = createRef();
  const options = {
    routePath: page.builderAppletSettingsItem,
    route: generatePath(page.builderAppletSettingsItem, {
      appletId: mockedAppletData.id,
      setting: SettingParam.ReportConfiguration,
    }),
  };

  if (isActivity) {
    options.routePath = page.builderAppletActivitySettingsItem;
    options.route = generatePath(page.builderAppletActivitySettingsItem, {
      appletId: mockedAppletData.id,
      activityId: mockedAppletData.activities[0].id,
      setting: SettingParam.ReportConfiguration,
    });
  }

  if (isActivityFlow) {
    options.routePath = page.builderAppletActivityFlowItemSettingsItem;
    options.route = generatePath(page.builderAppletActivityFlowItemSettingsItem, {
      appletId: mockedAppletData.id,
      activityFlowId: mockedAppletData.activityFlows[0].id,
      setting: SettingParam.ReportConfiguration,
    });
  }

  return renderWithAppletFormData({
    children: (
      <ReportConfigSetting onSubmitSuccess={() => {}} data-testid={mockedReportConfigDataTestid} />
    ),
    options,
    formRef: ref,
    ...(isServerConfigured && {
      reportServerIp: 'ip',
      reportPublicKey: 'key',
    }),
  });
};

const spyVerifyReportServer = jest.spyOn(reportUtils, 'verifyReportServer');
const spySetPasswordReportServer = jest.spyOn(reportUtils, 'setPasswordReportServer');

describe('ReportConfigSetting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Is rendered correctly', () => {
    test('Server URL/Server Public Key: fields are unset', () => {
      renderReportConfigSetting();

      expect(
        screen.getByText(
          'Report Server is not configured. The email with the report will not be sent.',
        ),
      ).toBeVisible();
    });

    test('Server URL/Server Public Key: fields are set', () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({
        result: { ...mockedAppletData, reportServerIp: 'ip', reportPublicKey: 'key' },
      });

      renderReportConfigSetting();

      expect(screen.getByText('Server Status: Connected.')).toBeVisible();
    });

    test.each`
      testId                                                          | label                      | value                                              | description
      ${`${mockedReportConfigDataTestid}-server-url`}                 | ${'Server URL'}            | ${''}                                              | ${'Server Url'}
      ${`${mockedReportConfigDataTestid}-encrypt-key`}                | ${'Public encryption key'} | ${''}                                              | ${'Public Key'}
      ${`${mockedReportConfigDataTestid}-recipients`}                 | ${'Add Recipients'}        | ${''}                                              | ${'Recipients'}
      ${`${mockedReportConfigDataTestid}-report-includes-respondent`} | ${'Respondent ID'}         | ${''}                                              | ${'Include Respondent ID'}
      ${`${mockedReportConfigDataTestid}-subject`}                    | ${''}                      | ${'REPORT: dataviz / [Activity Name]'}             | ${'Subject Preview'}
      ${`${mockedReportConfigDataTestid}-report-email-body`}          | ${''}                      | ${'Please see the report attached to this email.'} | ${'Email Body'}
    `('$description', ({ testId, label, value }) => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({
        result: mockedAppletData,
      });

      renderReportConfigSetting();

      const field = screen.getByTestId(testId);
      expect(field).toBeVisible();

      if (label) expect(field).toHaveTextContent(label);

      if (value) {
        const input = field.querySelector('input');
        expect(input ?? field)[input ? 'toHaveValue' : 'toHaveTextContent'](value);
      }
    });
  });

  describe('Server Ip/Public Key/Password', () => {
    test('Configure server: no server ip or publicKey', async () => {
      renderReportConfigSetting();

      const save = screen.getByTestId(`${mockedReportConfigDataTestid}-save`);

      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.getByTestId('builder-applet-settings-report-config-setting-save-anyway-popup'),
        ).toBeVisible();
        fireEvent.click(screen.getByText('Cancel'));
      });
    });

    test('Configure server: rejected verify server or publicKey', async () => {
      renderReportConfigSetting();

      const save = screen.getByTestId(`${mockedReportConfigDataTestid}-save`);

      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-server-url`).querySelector('input'),
        {
          target: { value: 'url' },
        },
      );
      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-encrypt-key`).querySelector('textarea'),
        {
          target: { value: 'publicKey' },
        },
      );
      spyVerifyReportServer.mockRejectedValueOnce({});
      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.getByTestId('applet-settings-report-config-verify-server-error-popup'),
        ).toBeVisible();
        fireEvent.click(screen.getByText('Ok'));
      });

      expect(spyVerifyReportServer).toBeCalledWith({
        url: 'url',
        publicKey: 'publicKey',
        token: 'null',
      });
      expect(spySetPasswordReportServer).not.toBeCalled();
    });

    test('Configure server: rejected set password', async () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({
        result: mockedAppletData,
      });
      jest.spyOn(encryptionUtils, 'getAppletEncryptionInfo').mockReturnValue({
        getPublicKey: () => ({ equals: () => true }),
      });

      renderReportConfigSetting();

      const save = screen.getByTestId(`${mockedReportConfigDataTestid}-save`);

      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-server-url`).querySelector('input'),
        {
          target: { value: 'https://url.com/' },
        },
      );
      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-encrypt-key`).querySelector('textarea'),
        {
          target: { value: 'publicKey' },
        },
      );

      spyVerifyReportServer.mockResolvedValueOnce(new Response(JSON.stringify({ message: 'ok' })));
      spySetPasswordReportServer.mockRejectedValueOnce({});

      fireEvent.click(save);

      await waitFor(() => {
        screen.getByTestId('report-config-password-popup');
      });

      fireEvent.change(
        screen
          .getByTestId('report-config-password-popup-enter-password-password')
          .querySelector('input'),
        { target: { value: mockedPassword } },
      );
      fireEvent.click(screen.getByTestId('report-config-password-popup-submit-button'));

      await waitFor(() => {
        expect(
          screen.getByTestId('applet-settings-report-config-verify-server-error-popup'),
        ).toBeVisible();
      });
    });

    test('Configure Server: all endpoints work', async () => {
      jest.spyOn(applet, 'useAppletData').mockReturnValue({
        result: mockedAppletData,
      });
      jest.spyOn(encryptionUtils, 'getAppletEncryptionInfo').mockReturnValue({
        getPublicKey: () => ({ equals: () => true }),
      });
      jest.spyOn(encryptionUtils, 'publicEncrypt').mockReturnValue({});
      jest.spyOn(reportApi, 'postReportConfigApi').mockResolvedValue({});

      const { store } = renderReportConfigSettingWithForm();

      const save = screen.getByTestId(`${mockedReportConfigDataTestid}-save`);

      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-server-url`).querySelector('input'),
        {
          target: { value: 'https://url.com/' },
        },
      );
      fireEvent.change(
        screen.getByTestId(`${mockedReportConfigDataTestid}-encrypt-key`).querySelector('textarea'),
        {
          target: { value: 'publicKey' },
        },
      );

      spyVerifyReportServer.mockResolvedValueOnce(new Response(JSON.stringify({ message: 'ok' })));
      spySetPasswordReportServer.mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'success' })),
      );

      fireEvent.click(save);

      await waitFor(() => {
        screen.getByTestId('report-config-password-popup');
      });

      fireEvent.change(
        screen
          .getByTestId('report-config-password-popup-enter-password-password')
          .querySelector('input'),
        { target: { value: mockedPassword } },
      );
      fireEvent.click(screen.getByTestId('report-config-password-popup-submit-button'));

      await waitFor(() => {
        expect(
          store
            .getState()
            .banners.data.banners.find(
              ({ bannerProps }) =>
                bannerProps?.['data-testid'] ===
                'builder-applet-settings-report-config-setting-success-banner',
            ),
        ).toBeDefined();
      });
    });

    test('Validations', async () => {
      renderReportConfigSetting();

      const email = screen.getByTestId(`${mockedReportConfigDataTestid}-recipients`);
      fireEvent.change(email.querySelector('input'), { target: { value: 'effeafawe ' } });
      fireEvent.click(screen.getByTestId(`${mockedReportConfigDataTestid}-save`));

      await waitFor(() => {
        expect(screen.getByText('Email must be valid')).toBeVisible();
      });
    });
  });

  describe('Activity/Activity Flow', () => {
    test.each`
      isActivity | description
      ${true}    | ${'Activity: Server is not configured'}
      ${false}   | ${'Activity Flow: Server is not configured'}
    `('$description', ({ isActivity }) => {
      renderReportConfigSettingWithForm({ isActivity, isActivityFlow: !isActivity });

      expect(
        screen.getByText('Server Status: Not Configured. Report can not be generated.'),
      ).toBeVisible();
      expect(screen.getByTestId(`${mockedReportConfigDataTestid}-configure-report`)).toBeVisible();
    });
  });

  test('Activity: fields', () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({
      result: { ...mockedAppletData, reportServerIp: 'ip', reportPublicKey: 'key' },
    });

    renderReportConfigSettingWithForm({ isActivity: true, isServerConfigured: true });

    expect(
      screen.getByTestId(`${mockedReportConfigDataTestid}-subject`).querySelector('input'),
    ).toHaveValue('REPORT: dataviz / New Activity');
    expect(screen.getByTestId(`${mockedReportConfigDataTestid}-item-value`)).toBeVisible();
  });

  test('Activity Flow: fields', () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({
      result: { ...mockedAppletData, reportServerIp: 'ip', reportPublicKey: 'key' },
    });

    renderReportConfigSettingWithForm({ isActivityFlow: true, isServerConfigured: true });

    expect(
      screen.getByTestId(`${mockedReportConfigDataTestid}-subject`).querySelector('input'),
    ).toHaveValue('REPORT: dataviz / af1');
    expect(screen.getByTestId(`${mockedReportConfigDataTestid}-item-value`)).toBeVisible();
  });

  test('Activity: Item Value', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({
      result: { ...mockedAppletData, reportServerIp: 'ip', reportPublicKey: 'key' },
    });

    renderReportConfigSettingWithForm({ isActivity: true, isServerConfigured: true });

    fireEvent.click(screen.getByTestId(`${mockedReportConfigDataTestid}-item-value`));

    const itemName = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-item-name`,
    );
    expect(itemName).toBeVisible();

    fireEvent.mouseDown(itemName.querySelector('[role=\'button\']'));

    const itemNameOptions = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-item-name-dropdown`,
    );

    expect(itemNameOptions).toBeVisible();
    expect(itemNameOptions.querySelectorAll('li')).toHaveLength(9);
  });

  test('Activity Flow: Item Value', async () => {
    jest.spyOn(applet, 'useAppletData').mockReturnValue({
      result: { ...mockedAppletData, reportServerIp: 'ip', reportPublicKey: 'key' },
    });

    renderReportConfigSettingWithForm({ isActivityFlow: true, isServerConfigured: true });

    fireEvent.click(screen.getByTestId(`${mockedReportConfigDataTestid}-item-value`));

    const itemName = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-item-name`,
    );
    const activityName = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-activity-name`,
    );
    expect(activityName).toBeVisible();
    expect(itemName).toBeVisible();

    expect(itemName.querySelector('label')).toHaveClass('Mui-disabled');

    fireEvent.mouseDown(activityName.querySelector('[role="button"]'));

    const activityNameOptions = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-activity-name-dropdown`,
    );

    expect(activityNameOptions).toBeVisible();
    expect(activityNameOptions.querySelectorAll('li')).toHaveLength(1);

    fireEvent.click(activityNameOptions.querySelectorAll('li')[0]);

    await waitFor(() => {
      expect(itemName.querySelector('label')).not.toHaveClass('Mui-disabled');
    });

    fireEvent.mouseDown(itemName.querySelector('[role="button"]'));

    const itemNameOptions = screen.getByTestId(
      `${mockedReportConfigDataTestid}-report-includes-item-name-dropdown`,
    );

    expect(itemNameOptions.querySelectorAll('li')).toHaveLength(9);
  });
});
