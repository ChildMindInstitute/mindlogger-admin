// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import * as reduxHooks from 'redux/store/hooks';

import * as cartUtils from './Cart.utils';
import { Cart } from './Cart';

const dataTestid = 'library-cart';
const mockDispatch = () => Promise.resolve('');
const mockUseNavigate = vi.fn();

const mockWorkspaces = [
  {
    ownerId: 'c48b275d-db4b-4f79-8469-9198b45985d3',
    workspaceName: 'Workspace 1',
    workspaceRoles: {},
  },
];

const mockCartApplets = [
  {
    id: 'f781279d-119f-4a97-9b0b-8bba0404d7f0',
    displayName: 'Lorem Ipsum',
    description: {
      en: 'Lorem Ipsum',
    },
    image: '',
    themeId: null,
    keywords: ['Lorem Ipsum'],
    activities: [
      {
        key: '31785418-abf2-4f43-a1af-ef535daf4e45',
        name: 'New Activity',
        description: {
          en: 'New Activity',
        },
        image: '',
        isPerformanceTask: false,
        performanceTaskType: null,
        items: [
          {
            question: {
              en: 'Single Selection',
            },
            responseType: 'singleSelect',
            responseValues: {
              options: [
                {
                  text: '1',
                  value: 0,
                },
                {
                  text: '2',
                  value: 1,
                },
              ],
              paletteName: null,
            },
            name: 'Item1',
          },
        ],
      },
      {
        key: 'a4a714fb-68fa-4936-9498-e933e57b992a',
        name: 'A/B Trails Mobile',
        description: {
          en: 'A/B Trails',
        },
        image: '',
        isPerformanceTask: true,
        performanceTaskType: 'ABTrails',
        items: [],
      },
    ],
    activityFlows: [],
    version: '1.1.0',
  },
  {
    id: '4e76faca-45d1-4bf6-9c2f-26572aa79c8a',
    displayName: 'Test Applet Library',
    description: {
      en: 'Description',
    },
    image: '',
    keywords: ['library', 'small', 'abtrails'],
    activities: [
      {
        key: '7fddb058-25e7-4289-ab0b-d47aed0bb5e3',
        name: 'Activity 1',
        description: {
          en: 'activity description',
        },
        image: '',
        isPerformanceTask: false,
        performanceTaskType: null,
        items: [
          {
            question: {
              en: 'num',
            },
            responseType: 'numberSelect',
            responseValues: {
              maxValue: 5,
              minValue: 1,
            },
            name: 'Item2',
          },
        ],
      },
    ],
    activityFlows: [],
    version: '1.1.0',
  },
];

const getPreloadedState = ({ isAuthorized, status, hasCartApplets }) => ({
  auth: {
    isAuthorized,
  },
  library: {
    isAddToBuilderBtnDisabled: { data: false },
    cartApplets: {
      status,
      data: hasCartApplets ? { result: mockCartApplets } : null,
    },
  },
});

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

vi.mock('modules/Library/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useWorkspaceList: () => ({
      workspaces: mockWorkspaces,
    }),
  };
});

describe('Cart', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
  });

  test('renders loading spinner when applets are loading', () => {
    renderWithProviders(<Cart />, {
      preloadedState: getPreloadedState({
        isAuthorized: true,
        status: 'loading',
      }),
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders empty state when there are no items in the cart', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: getPreloadedState({
        isAuthorized: true,
        status: 'idle',
      }),
    });

    const backButton = screen.getByTestId('library-back-button');
    await userEvent.click(backButton);
    expect(mockUseNavigate).toBeCalledWith('/library');

    const searchInput = screen.getByTestId('library-search');
    expect(searchInput).toBeVisible();

    const appletsCountElement = screen.queryByTestId(`${dataTestid}-applets-count`);
    expect(appletsCountElement).not.toBeInTheDocument();

    const cartButton = screen.getByTestId('library-add-to-builder');
    expect(cartButton).toBeInTheDocument();
    expect(cartButton).toBeDisabled();

    const emptyStateLink = screen.getByTestId(`${dataTestid}-go-to-library`);
    expect(emptyStateLink).toBeInTheDocument();
    expect(emptyStateLink).toHaveAttribute('href', '/library');
    expect(emptyStateLink).toHaveTextContent('Applets Catalog');

    expect(
      screen.getByText(/You have not added anything to your cart yet. Add Applets from the/),
    ).toBeInTheDocument();
  });

  test('renders applet list when there are items in the cart', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: getPreloadedState({
        isAuthorized: true,
        status: 'idle',
        hasCartApplets: true,
      }),
    });

    expect(screen.getByTestId('library-header')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();

    expect(screen.queryAllByTestId(/library-cart-applet-\d+$/)).toHaveLength(2);

    const searchContainer = screen.getByTestId('library-search');
    expect(searchContainer).toBeInTheDocument();
    const searchInput = searchContainer.querySelector('input');

    await userEvent.type(searchInput, 'lorem ipsum');
    await waitFor(() => {
      expect(screen.queryAllByTestId(/library-cart-applet-\d+$/)).toHaveLength(1);
    });

    const highlightedTexts = screen.getAllByText(/lorem ipsum/i);
    highlightedTexts.forEach((highlightedText) => {
      const parentElement = highlightedText.closest('.highlighted-text');
      expect(highlightedText).toBeInTheDocument();
      expect(parentElement).toHaveClass('highlighted-text');
    });
  });

  test('renders auth popup when unauthorized user tries to add to builder', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: getPreloadedState({
        isAuthorized: false,
        status: 'idle',
        hasCartApplets: true,
      }),
    });

    const addToBuilderBtn = screen.getByTestId('library-add-to-builder');
    await userEvent.click(addToBuilderBtn);

    expect(screen.getByTestId('library-auth-popup')).toBeInTheDocument();
  });

  test('calls navigateToBuilder when authorized user adds to builder', async () => {
    const mockNavigateToBuilder = vi.fn();
    vi.spyOn(cartUtils, 'navigateToBuilder').mockImplementationOnce(mockNavigateToBuilder);

    renderWithProviders(<Cart />, {
      preloadedState: getPreloadedState({
        isAuthorized: true,
        status: 'idle',
        hasCartApplets: true,
      }),
    });

    const addToBuilderBtn = screen.getByTestId('library-add-to-builder');
    await userEvent.click(addToBuilderBtn);

    expect(mockNavigateToBuilder).toHaveBeenCalledWith(
      mockUseNavigate,
      'new-applet',
      expect.any(Object),
    );
  });
});
