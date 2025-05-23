// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { MAX_LIMIT } from 'shared/consts';
import { ApiResponseCodes } from 'api';
import * as reduxHooks from 'redux/store/hooks';
import * as sharedHooks from 'shared/hooks';
import * as libraryHooks from 'modules/Library/hooks';
import * as cartUtils from 'modules/Library/features/Cart/Cart.utils';

import { AddToBuilderPopup } from './AddToBuilderPopup';
import { __esModule } from 'linkifyjs';

const mockDispatch = () => Promise.resolve('');
const mockUseNavigate = vi.fn();
const mockNavigateToBuilder = vi.fn();
const mockSetAddToBuilderPopupVisible = vi.fn();
const dataTestid = 'library-cart-add-to-builder-popup';

const mockWorkspaces = [
  {
    ownerId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
    workspaceName: 'Workspace 1',
  },
  {
    ownerId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
    workspaceName: 'Workspace 2',
  },
];

const applets = [
  {
    id: 'a341e3d7-0170-4894-8823-798c58456130',
    displayName: 'Applet 1',
    image: '',
    encryption: {
      publicKey: 'publicKey',
      prime: 'prime',
      base: '[2]',
      accountId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
    },
    createdAt: '2024-02-13T18:10:20.530872',
    updatedAt: '2024-02-13T20:06:12.930074',
    version: '2.0.0',
    role: 'owner',
    type: 'applet',
    description: {
      en: 'Applet 1',
    },
    activityCount: 2,
  },
  {
    id: '6d195670-726d-4c36-8682-c9f2615827dd',
    displayName: 'Applet 2',
    image: '',
    encryption: {
      publicKey: 'publicKey',
      prime: 'prime',
      base: '[2]',
      accountId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
    },
    createdAt: '2023-12-29T14:31:41.277667',
    updatedAt: '2024-01-09T13:59:38.702814',
    version: '4.2.0',
    role: 'owner',
    type: 'applet',
    foldersAppletCount: 0,
    description: {
      en: 'Applet 2',
    },
    activityCount: 4,
  },
];

const successfulGetExpandedAppletsMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: applets,
    count: 2,
  },
};

const preloadedState = {
  workspaces: {
    currentWorkspace: { data: mockWorkspaces[0] },
  },
  library: {
    cartApplets: {
      data: [
        {
          id: 'd8c5096c-e9f0-454f-b757-67a1d60fdcdf',
          displayName: 'Cart Applet',
          description: {
            en: 'Cart Applet',
          },
          keywords: ['keyword1', 'keyword2'],
          activities: [],
          activityFlows: [],
          version: '1.1.1',
        },
      ],
    },
  },
};

vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

vi.mock('redux/store/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAppDispatch: vi.fn(),
  };
});

vi.mock('shared/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
  };
});

vi.mock('modules/Library/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    __esModule: true,
  };
});

(cartUtils as never).navigateToBuilder = mockNavigateToBuilder;
(cartUtils as never).getAddToBuilderData = () => ({
  appletToBuilder: {},
});

const testStep1 = async ({ title }) => {
  expect(title).toHaveTextContent('Select Workspace');
  expect(screen.getByTestId(`${dataTestid}-step-1`)).toBeInTheDocument();
  const tableRows = screen.queryAllByTestId(/table-row-\d+/);
  expect(tableRows).toHaveLength(2); // mocked 2 workspaces

  const radio = within(tableRows[1]).getByRole('radio');
  await userEvent.click(radio); // select the second workspace
};

const testStep2 = async ({ rerender, title }) => {
  expect(title).toHaveTextContent('Select Adding Type');
  expect(screen.getByTestId(`${dataTestid}-step-2`)).toBeInTheDocument();
  const selectActions = await screen.findByTestId(`${dataTestid}-select-action`);
  expect(selectActions).toBeInTheDocument();

  expect(axios.get).toBeCalledWith('/workspaces/c48b275d-db4b-4f79-8469-9198b45985d3/applets', {
    params: {
      flatList: true,
      limit: MAX_LIMIT,
    },
    signal: undefined,
  });

  rerender(
    <AddToBuilderPopup
      addToBuilderPopupVisible={true}
      setAddToBuilderPopupVisible={mockSetAddToBuilderPopupVisible}
    />,
  );

  expect(
    screen.queryAllByTestId(/library-cart-add-to-builder-popup-select-action-\d+$/),
  ).toHaveLength(2); // mocked 2 applets

  expect(screen.getByText('Create a new Applet with selected activities')).toBeInTheDocument(); // 0
  expect(screen.getByText('Add to an existing Applet')).toBeInTheDocument(); // 1
};

const renderAddToBuilderPopup = ({
  isLoading = false,
  workspaces,
  checkIfHasAccessToWorkspace,
}) => {
  vi.spyOn(libraryHooks, 'useWorkspaceList').mockReturnValue({
    workspaces,
    isLoading,
    checkIfHasAccessToWorkspace: () => checkIfHasAccessToWorkspace,
  });

  return renderWithProviders(
    <AddToBuilderPopup
      addToBuilderPopupVisible={true}
      setAddToBuilderPopupVisible={mockSetAddToBuilderPopupVisible}
    />,
    { preloadedState },
  );
};

describe('AddToBuilderPopup', () => {
  beforeEach(() => {
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('renders component and test loading, cancel button', async () => {
    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(true);

    renderAddToBuilderPopup({
      isLoading: true,
      workspaces: [],
      checkIfHasAccessToWorkspace: true,
    });

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 0: loading
    expect(title).toHaveTextContent('Checking your workspaces');
    expect(screen.getByTestId(`${dataTestid}-step-0`)).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockSetAddToBuilderPopupVisible).toHaveBeenCalledWith(false);
  });

  test('test steps when workspaces length = 1 (skip workspace select step)', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(true);
    const workspaces = mockWorkspaces[0];

    renderAddToBuilderPopup({
      checkIfHasAccessToWorkspace: true,
      workspaces: [workspaces],
    });

    expect(screen.getByTestId('library-cart-add-to-builder-popup')).toBeInTheDocument();
    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 1: workspace selection should be skipped
    expect(screen.queryByTestId(`${dataTestid}-step-1`)).not.toBeInTheDocument();

    // step 2: add to builder actions
    expect(title).toHaveTextContent('Select Adding Type');
    expect(screen.getByTestId(`${dataTestid}-step-2`)).toBeInTheDocument();
  });

  test('test steps: workspace selection (with error) -> add to builder actions -> navigate to new applet', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(true);

    const { rerender } = renderAddToBuilderPopup({
      workspaces: mockWorkspaces,
      checkIfHasAccessToWorkspace: true,
    });

    expect(screen.getByTestId('library-cart-add-to-builder-popup')).toBeInTheDocument();
    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 1: workspace selection
    expect(title).toHaveTextContent('Select Workspace');
    expect(screen.getByTestId(`${dataTestid}-step-1`)).toBeInTheDocument();

    const selectWorkspaceTable = screen.getByTestId('select-workspace-table');
    expect(selectWorkspaceTable).toBeInTheDocument();

    const tableRows = screen.queryAllByTestId(/table-row-\d+/);
    expect(tableRows).toHaveLength(2); // mocked 2 workspaces

    const confirmButton = screen.getByTestId(`${dataTestid}-submit-button`);
    expect(confirmButton).toBeInTheDocument();
    await userEvent.click(confirmButton);

    // test error for workspace selection
    const errorMessage = screen.getByText('Please select the Workspace to proceed.');
    expect(errorMessage).toBeInTheDocument();

    const radio = within(tableRows[1]).getByRole('radio');
    await userEvent.click(radio); // select the second workspace
    await userEvent.click(confirmButton); // go to next step

    // step 2: add to builder actions
    await testStep2({ rerender, title });

    const container0 = screen.getByTestId(`${dataTestid}-select-action-0`);
    expect(container0.querySelector('input:checked')).toBeInTheDocument(); // by default "create a new applet with selected activities"

    await userEvent.click(confirmButton);

    // navigate to new applet
    expect(mockNavigateToBuilder).toHaveBeenCalledWith(mockUseNavigate, 'new-applet', {});
    expect(mockSetAddToBuilderPopupVisible).toHaveBeenCalledWith(false);
  });

  test('test steps: workspace selection -> add to builder actions -> select applet -> navigate to existing applet', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);

    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(true);

    const { rerender } = renderAddToBuilderPopup({
      workspaces: mockWorkspaces,
      checkIfHasAccessToWorkspace: true,
    });

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 1: workspace selection
    const confirmButton = screen.getByTestId(`${dataTestid}-submit-button`);
    await testStep1({ title });
    await userEvent.click(confirmButton); // go to next step

    // step 2: add to builder actions
    await testStep2({ rerender, title });

    const container0 = screen.getByTestId(`${dataTestid}-select-action-0`);
    expect(container0.querySelector('input:checked')).toBeInTheDocument(); // by default "create a new applet with selected activities"
    const actionContainer1 = screen.getByTestId(`${dataTestid}-select-action-1`);

    await userEvent.click(actionContainer1.querySelector('input')); // select "add to an existing applet"
    await userEvent.click(confirmButton);

    // step 3: select applet
    expect(screen.getByTestId(`${dataTestid}-step-3`)).toBeInTheDocument();
    expect(title).toHaveTextContent('Select Applet');
    expect(
      screen.getByText(
        'All selected content will be added to an Applet which you select additionally to the existing content in it.',
      ),
    ).toBeInTheDocument();

    const backButton = screen.getByText('Back');
    await userEvent.click(backButton);

    // back to step 2: add to builder actions
    expect(screen.getByTestId(`${dataTestid}-step-2`)).toBeInTheDocument();
    expect(axios.get).toBeCalledWith('/workspaces/c48b275d-db4b-4f79-8469-9198b45985d3/applets', {
      params: {
        flatList: true,
        limit: MAX_LIMIT,
      },
      signal: undefined,
    });

    rerender(
      <AddToBuilderPopup
        addToBuilderPopupVisible={true}
        setAddToBuilderPopupVisible={mockSetAddToBuilderPopupVisible}
      />,
    );

    await userEvent.click(confirmButton);

    // step 3: select applet
    const applets = await screen.findAllByTestId(
      /library-cart-add-to-builder-popup-select-applet-\d+$/,
    );
    expect(applets).toHaveLength(2);

    const appletContainer1 = screen.getByTestId(`${dataTestid}-select-applet-1`);

    await userEvent.click(appletContainer1.querySelector('input')); // select the second applet
    await userEvent.click(confirmButton);

    // handleAddToExistingApplet
    expect(axios.get).toBeCalledWith('/workspaces/c48b275d-db4b-4f79-8469-9198b45985d3/applets', {
      params: {
        flatList: true,
        limit: MAX_LIMIT,
      },
      signal: undefined,
    });

    // navigate to existing applet
    expect(mockNavigateToBuilder).toHaveBeenCalledWith(
      mockUseNavigate,
      '6d195670-726d-4c36-8682-c9f2615827dd',
      {},
    );
    expect(mockSetAddToBuilderPopupVisible).toHaveBeenCalledWith(false);
  });

  test('test steps (with offline mode): workspace selection -> add to builder actions -> select applet -> error', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);

    const { rerender } = renderAddToBuilderPopup({
      workspaces: mockWorkspaces,
      checkIfHasAccessToWorkspace: true,
    });

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 1: workspace selection
    const confirmButton = screen.getByTestId(`${dataTestid}-submit-button`);
    await testStep1({ title });
    await userEvent.click(confirmButton); // go to next step

    // step 2: add to builder actions
    await testStep2({ rerender, title });

    const container0 = screen.getByTestId(`${dataTestid}-select-action-0`);
    expect(container0.querySelector('input:checked')).toBeInTheDocument(); // by default "create a new applet with selected activities"

    const actionContainer1 = screen.getByTestId(`${dataTestid}-select-action-1`);

    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(false);

    await userEvent.click(actionContainer1.querySelector('input')); // select "add to an existing applet"
    await userEvent.click(confirmButton);

    // step 3: select applet
    expect(title).toHaveTextContent('Add to Builder');
    expect(
      screen.getByText('Cart content has not been added to the builder. Please try again.'),
    ).toBeInTheDocument(); // error step

    await userEvent.click(confirmButton);

    expect(axios.get).toBeCalledWith('/workspaces/c48b275d-db4b-4f79-8469-9198b45985d3/applets', {
      params: {
        flatList: true,
        limit: MAX_LIMIT,
      },
      signal: undefined,
    });
  });

  test('test steps (with no access): workspace selection -> add to builder actions -> error', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);
    vi.mocked(axios.get).mockResolvedValueOnce(successfulGetExpandedAppletsMock);

    vi.spyOn(sharedHooks, 'useNetwork').mockReturnValue(true);

    const { rerender } = renderAddToBuilderPopup({
      workspaces: mockWorkspaces,
      checkIfHasAccessToWorkspace: false,
    });

    const title = screen.getByTestId(`${dataTestid}-title`);
    expect(title).toBeInTheDocument();

    // step 1: workspace selection
    const confirmButton = screen.getByTestId(`${dataTestid}-submit-button`);
    await testStep1({ title });
    await userEvent.click(confirmButton); // go to next step

    // step 2: add to builder actions
    await testStep2({ rerender, title });

    const container0 = screen.getByTestId(`${dataTestid}-select-action-0`);
    expect(container0.querySelector('input:checked')).toBeInTheDocument(); // by default "create a new applet with selected activities"

    const actionContainer1 = screen.getByTestId(`${dataTestid}-select-action-1`);

    await userEvent.click(actionContainer1.querySelector('input')); // select "add to an existing applet"
    await userEvent.click(confirmButton);

    // step with no access
    expect(title).toHaveTextContent('No Access');
    expect(screen.getByText('Your access to the workspace was removed.')).toBeInTheDocument();

    await userEvent.click(confirmButton);

    expect(mockSetAddToBuilderPopupVisible).toHaveBeenCalledWith(false);
  });
});
