// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { generatePath } from 'react-router-dom';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { page } from 'resources';
import { applet } from 'redux/modules';
import { mockedAppletData } from 'shared/mock';
import { SettingParam, renderWithProviders } from 'shared/utils';

import { ReportConfigSetting } from './ReportConfigSetting';
import * as reportUtils from './ReportConfigSetting.utils';

const mockedReportConfigDataTestid = 'report-config';
const renderReportConfigSetting = () => {
  const ref = renderWithProviders(
    <ReportConfigSetting onSubmitSuccess={() => {}} data-testid={mockedReportConfigDataTestid} />,
    {
      routePath: page.builderAppletSettingsItem,
      route: generatePath(page.builderAppletSettingsItem, {
        appletId: mockedAppletData.id,
        setting: SettingParam.ReportConfiguration,
      }),
    },
  );

  return ref;
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
    test('Configure server', async () => {
      renderReportConfigSetting();

      const save = screen.getByTestId(`${mockedReportConfigDataTestid}-save`);

      fireEvent.click(save);

      await waitFor(() => {
        expect(
          screen.getByTestId('builder-applet-settings-report-config-setting-save-anyway-popup'),
        ).toBeVisible();
        fireEvent.click(screen.getByText('Cancel'));
      });

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

    test('edit', async () => {});

    test('validations', async () => {});
  });

  describe('Activity/Activity Flow', () => {});
});
