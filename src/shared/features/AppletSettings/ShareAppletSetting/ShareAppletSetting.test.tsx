import { fireEvent, screen, waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { SettingParam, renderWithProviders } from 'shared/utils';
import { ApiResponseCodes } from 'api';
import { initialStateData } from 'shared/state';
import { mockedApplet, mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { Roles } from 'shared/consts';

import { ShareAppletSetting } from './ShareAppletSetting';

const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
};

describe('ShareAppletSetting', () => {
  describe('should render and submit', () => {
    test.each`
      route                                                                  | routePath                         | description
      ${`/dashboard/${mockedAppletId}/settings/${SettingParam.ShareApplet}`} | ${page.appletSettingsItem}        | ${'for dashboard'}
      ${`/builder/${mockedAppletId}/settings/${SettingParam.ShareApplet}`}   | ${page.builderAppletSettingsItem} | ${'for builder'}
    `('$description', async ({ route, routePath }) => {
      const dataTestid = 'applet-settings-share-to-library';
      const libraryUrl = 'library-url';

      mockAxios.post.mockResolvedValueOnce({
        payload: {
          response: {
            status: ApiResponseCodes.SuccessfulResponse,
            data: null,
          },
        },
      });

      mockAxios.get.mockResolvedValueOnce({
        data: {
          result: {
            url: libraryUrl,
          },
        },
      });

      renderWithProviders(<ShareAppletSetting />, {
        route,
        routePath,
        preloadedState,
      });

      expect(mockAxios.post).toHaveBeenNthCalledWith(
        1,
        '/library/check_name',
        { name: 'displayName' },
        { signal: undefined },
      );

      expect(screen.getByTestId(`${dataTestid}-form`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-applet-name`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-keywords`)).toBeVisible();
      expect(screen.getByTestId(`${dataTestid}-agreement`)).toBeVisible();

      const keywordsContainer = screen.getByTestId(`${dataTestid}-keywords`);
      const keywordsInput = keywordsContainer.querySelector('input') as HTMLElement;
      const mockedKeyword = 'Keyword';

      fireEvent.change(keywordsInput, {
        target: { value: mockedKeyword },
      });
      fireEvent.keyDown(keywordsInput, { key: 'Enter' });

      const agreementContainer = screen.getByTestId(`${dataTestid}-agreement`);
      const agreementInput = agreementContainer.querySelector('input') as HTMLInputElement;
      fireEvent.click(agreementInput);
      fireEvent.click(screen.getByText('Share'));

      await waitFor(() => {
        expect(mockAxios.post).toHaveBeenNthCalledWith(
          3,
          '/library',
          { appletId: mockedAppletId, name: 'displayName', keywords: [mockedKeyword] },
          { signal: undefined },
        );

        expect(mockAxios.get).toHaveBeenNthCalledWith(
          1,
          `/applets/${mockedApplet.id}/library_link`,
          {
            signal: undefined,
          },
        );
      });

      const successPopup = await screen.findByTestId(`${dataTestid}-share-success-popup`);
      expect(successPopup).toBeVisible();
    });
  });
});
