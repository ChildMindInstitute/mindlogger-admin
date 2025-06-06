import { fireEvent, waitFor, screen, act } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedAppletId, mockedOwnerId, mockedPassword } from 'shared/mock';
import { Roles } from 'shared/consts';
import { getPreloadedState } from 'shared/tests/getPreloadedState';

import * as appletsTableHooks from '../AppletsTable.hooks';
import { AppletsContext } from '../../Applets.context';
import { AppletItem } from './AppletItem';

const mockReloadData = jest.fn();
const mockHandleFolderClick = jest.fn();

const getMockedApplet = (isAppletInFolder = false, hasEncryption = true) => ({
  ...mockedApplet,
  parentId: isAppletInFolder ? 'mockedParentId' : undefined,
  isPinned: false,
  ...(hasEncryption ? {} : { encryption: undefined }),
});

const mockContext = {
  rows: [getMockedApplet()],
  setRows: jest.fn(),
  expandedFolders: [],
  reloadData: mockReloadData,
  handleFolderClick: mockHandleFolderClick,
  fetchData: jest.fn(),
};

const getAppletItemComponent = (isAppletInFolder = false, hasEncryption = true) => (
  <AppletsContext.Provider value={mockContext}>
    <table>
      <tbody>
        <AppletItem item={getMockedApplet(isAppletInFolder, hasEncryption)} onPublish={jest.fn} />
      </tbody>
    </table>
  </AppletsContext.Provider>
);

const clickActionDots = async () => {
  const actionsDots = await waitFor(() =>
    screen.getByTestId('dashboard-applets-table-applet-actions-dots'),
  );
  fireEvent.click(actionsDots);
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

describe('AppletItem component tests', () => {
  test('should render applet row', () => {
    renderWithProviders(getAppletItemComponent(), { preloadedState: getPreloadedState() });

    expect(screen.getByRole('row')).toBeInTheDocument();
    expect(screen.getByText('displayName')).toBeInTheDocument();
  });

  describe('should appear particular actions on actions button click for ', () => {
    const commonActionsTestIds = [
      'dashboard-applets-applet-view-users',
      'dashboard-applets-applet-view-calendar',
      'dashboard-applets-applet-edit',
      'dashboard-applets-applet-duplicate',
      'dashboard-applets-applet-delete',
    ];
    const ownerActionsTestIds = [...commonActionsTestIds, 'dashboard-applets-applet-transfer'];
    const superAdminActionsTestIds = [
      ...ownerActionsTestIds,
      'dashboard-applets-applet-publish-conceal',
    ];

    test.each`
      role                | actionsDataTestIds          | description
      ${Roles.Manager}    | ${commonActionsTestIds}     | ${'manager'}
      ${Roles.SuperAdmin} | ${superAdminActionsTestIds} | ${'superAdmin'}
      ${Roles.Owner}      | ${ownerActionsTestIds}      | ${'owner'}
    `('$description', async ({ role, actionsDataTestIds }) => {
      renderWithProviders(getAppletItemComponent(), { preloadedState: getPreloadedState(role) });

      await clickActionDots();

      await waitFor(() => {
        actionsDataTestIds.forEach((dataTestId: string) =>
          expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
        );
      });
    });
  });

  test('superAdmin should publish applet', async () => {
    renderWithProviders(getAppletItemComponent(), {
      preloadedState: getPreloadedState(Roles.SuperAdmin),
    });

    await clickActionDots();
    const publishAction = screen.getByTestId('dashboard-applets-applet-publish-conceal');

    expect(publishAction).toBeInTheDocument();
  });

  test('should appear password popup for applet without encryption', async () => {
    renderWithProviders(getAppletItemComponent(false, false), {
      preloadedState: getPreloadedState(Roles.Owner),
    });

    await clickActionDots();
    fireEvent.click(screen.getByTestId('dashboard-applets-applet-duplicate'));

    expect(screen.getByTestId('dashboard-applets-password-popup')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: mockedPassword } });
    fireEvent.change(screen.getByLabelText('Repeat the password'), {
      target: { value: mockedPassword },
    });
    act(() => fireEvent.click(screen.getByText('Submit')));

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/applets/${mockedAppletId}/encryption`,
        expect.anything(),
        { singal: undefined },
      );
    });
  });

  describe('should navigate to a particular route for applet actions', () => {
    test.each`
      actionTestId       | route                                          | description
      ${'view-users'}    | ${`/dashboard/${mockedAppletId}/participants`} | ${'view users'}
      ${'view-calendar'} | ${`/dashboard/${mockedAppletId}/schedule`}     | ${'view calendar'}
      ${'edit'}          | ${`/builder/${mockedAppletId}`}                | ${'edit applet'}
    `('$description', async ({ actionTestId, route }) => {
      renderWithProviders(getAppletItemComponent(), { preloadedState: getPreloadedState() });

      await clickActionDots();
      fireEvent.click(screen.getByTestId(`dashboard-applets-applet-${actionTestId}`));

      expect(mockedUseNavigate).nthCalledWith(1, route);
    });
  });

  test('should navigate to overview page on applet click', async () => {
    renderWithProviders(getAppletItemComponent(), { preloadedState: getPreloadedState() });

    fireEvent.click(screen.getByText('displayName'));

    expect(mockedUseNavigate).nthCalledWith(1, `/dashboard/${mockedAppletId}/overview`);
  });

  test('should pin applet in folder', async () => {
    mockAxios.post.mockResolvedValueOnce(null);
    renderWithProviders(getAppletItemComponent(true), { preloadedState: getPreloadedState() });

    const appletPin = await waitFor(() => screen.getByTestId('dashboard-applets-pin'));
    fireEvent.click(appletPin);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/folders/mockedParentId/pin/${mockedAppletId}`,
        {},
        { signal: undefined },
      );
    });
  });

  test('should remove applet from folder', async () => {
    renderWithProviders(getAppletItemComponent(true), { preloadedState: getPreloadedState() });

    await clickActionDots();
    fireEvent.click(screen.getByTestId('dashboard-applets-applet-remove-from-folder'));

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        '/applets/set_folder',
        { appletId: mockedAppletId, folderId: undefined },
        { signal: undefined },
      );
    });
  });

  test('should have correct classnames for hover and for isDragOver', async () => {
    const commonUseDndProps = {
      onDragLeave: jest.fn(),
      onDragOver: jest.fn(),
      onDrop: jest.fn(),
      onDragEnd: jest.fn(),
    };
    jest.spyOn(appletsTableHooks, 'useAppletsDnd').mockReturnValue({
      isDragOver: false,
      ...commonUseDndProps,
    });

    const { findByTestId, rerender } = renderWithProviders(getAppletItemComponent());

    const tableRow = await findByTestId('dashboard-applets-table-applet-row');

    expect(tableRow).toBeInTheDocument();
    expect(tableRow).toHaveClass('MuiTableRow-has-hover');
    expect(tableRow).not.toHaveClass('MuiTableRow-dragged-over');

    jest.spyOn(appletsTableHooks, 'useAppletsDnd').mockReturnValue({
      isDragOver: true,
      ...commonUseDndProps,
    });

    rerender(getAppletItemComponent());

    expect(tableRow).toHaveClass('MuiTableRow-has-hover MuiTableRow-dragged-over');
  });
});
