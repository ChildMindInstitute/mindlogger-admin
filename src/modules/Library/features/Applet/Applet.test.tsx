import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'shared/utils';
import { page } from 'resources';
import * as reduxHooks from 'redux/store/hooks';
import { library } from 'redux/modules';

import { Applet } from './Applet';
import { AppletUiType } from './Applet.types';

const mockApplet = {
  id: 'd8c5096c-e9f0-454f-b757-67a1d60fdcdf',
  displayName: 'Applet Share Test',
  description: {
    en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa. Sed nunc orci, elementum nec sodales faucibus, luctus id nisi.',
  },
  image:
    'https://media-dev.cmiml.net/mindlogger/967285597925030445/ca0ab396-1187-4bf8-b6b3-1239895eea64/pexels-photo-8910681.jpeg',
  keywords: ['keyword1', 'keyword2'],
  activities: [
    {
      key: '8e78dc82-3a84-4bdc-b5f6-596d3bdadc72',
      name: 'New Activity 1',
      description: {
        en: '',
      },
      image: '',
      isPerformanceTask: false,
      performanceTaskType: null,
      items: [
        {
          question: {
            en: 'It`s single select item',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                text: 'Option 1',
                value: 0,
              },
              {
                text: 'Option 2',
                value: 1,
              },
            ],
            paletteName: null,
          },
          config: {},
          name: 'Item1',
        },
      ],
    },
    {
      key: 'b238b5b2-e3f5-4384-998b-0146455d7a41',
      name: 'New Activity 2',
      description: {
        en: '',
      },
      image: '',
      isPerformanceTask: false,
      performanceTaskType: null,
      items: [
        {
          question: {
            en: 'It`s geolocation item',
          },
          responseType: 'geolocation',
          config: {},
          name: 'Item1',
        },
      ],
    },
    {
      key: '7ca53d10-4d7f-4743-9524-477634b83631',
      name: 'CST Touch',
      description: {
        en: 'This Activity contains Stability Tracker (Touch) Item.',
      },
      image: '',
      isPerformanceTask: true,
      performanceTaskType: 'touch',
      items: [],
    },
  ],
  version: '1.1.1',
};

const preloadedState = {
  auth: {
    isAuthorized: true,
  },
  cartApplets: {
    data: null,
  },
};

const dataTestid = 'library-applet';
const mockedUseNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockSetSearch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('redux/store/hooks', () => ({
  ...jest.requireActual('redux/store/hooks'),
  useAppDispatch: jest.fn(),
}));

describe('Applet', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    sessionStorage.clear();
  });

  test('renders applet information for uiType = List, search by keyword and view details', async () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

    renderWithProviders(
      <Applet
        applet={mockApplet}
        uiType={AppletUiType.List}
        data-testid={dataTestid}
        setSearch={mockSetSearch}
      />,
      {
        route: '/library',
        routePath: page.library,
        preloadedState,
      },
    );

    expect(screen.getByText('Applet Share Test')).toBeInTheDocument();
    expect(screen.getByText('1.1.1')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa. Sed nunc orci, elementum nec sodales faucibus, luctus id nisi.',
      ),
    ).toBeInTheDocument();

    const keywordsRegex = new RegExp(`${dataTestid}-keywords-\\d+$`);
    expect(screen.queryAllByTestId(keywordsRegex)).toHaveLength(2);

    await userEvent.click(screen.getByTestId(`${dataTestid}-keywords-0`));

    expect(mockSetSearch).toHaveBeenCalledWith('keyword1'); // first keyword value

    const viewDetailsButton = screen.getByTestId(`${dataTestid}-view-details`);
    const addToCartButton = screen.getByTestId(`${dataTestid}-add-to-cart`);

    expect(viewDetailsButton).toBeInTheDocument();
    expect(addToCartButton).toBeInTheDocument();
    expect(addToCartButton).toBeDisabled();

    await userEvent.click(viewDetailsButton);

    expect(mockedUseNavigate).toHaveBeenCalledWith(`/library/${mockApplet.id}`);
  });

  test('renders applet information for uiType = List, select activity and add to cart', async () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    const addAppletToCartMock = jest.spyOn(library.thunk, 'postAppletsToCart');

    renderWithProviders(
      <Applet
        applet={mockApplet}
        uiType={AppletUiType.List}
        data-testid={dataTestid}
        setSearch={mockSetSearch}
      />,
      {
        route: '/library',
        routePath: page.library,
        preloadedState,
      },
    );

    const activitiesRegex = new RegExp(`${dataTestid}-activities-\\d+$`);
    expect(screen.queryAllByTestId(activitiesRegex)).toHaveLength(0);

    const activitiesCollapse = screen.getByTestId(`${dataTestid}-activities-collapse`);
    expect(activitiesCollapse).toBeInTheDocument();
    await userEvent.click(activitiesCollapse);

    expect(screen.queryAllByTestId(activitiesRegex)).toHaveLength(3);

    // check all to be unchecked by default
    const activities = screen.queryAllByTestId(activitiesRegex);
    activities.forEach((activity) => {
      const checkbox = activity.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toHaveAttribute('checked');
    });

    // check first one
    const activity0Checkbox = activities[0].querySelector('input[type="checkbox"]');
    await userEvent.click(activity0Checkbox);

    expect(activity0Checkbox).toBeChecked();
    const addToCartButton = screen.getByTestId(`${dataTestid}-add-to-cart`);
    expect(addToCartButton).not.toBeDisabled();

    await userEvent.click(addToCartButton);

    expect(addAppletToCartMock).toHaveBeenCalledWith([mockApplet]);

    sessionStorage.clear(); // clear session storage for the next test
  });

  test('renders applet information for uiType = Details, select activity and add to cart', async () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    const addAppletToCartMock = jest.spyOn(library.thunk, 'postAppletsToCart');

    renderWithProviders(
      <Applet
        applet={mockApplet}
        uiType={AppletUiType.Details}
        data-testid={dataTestid}
        setSearch={mockSetSearch}
      />,
      {
        route: '/library',
        routePath: page.library,
        preloadedState,
      },
    );

    const activitiesRegex = new RegExp(`${dataTestid}-activities-\\d+$`);
    const activitiesCollapse = screen.queryByTestId(`${dataTestid}-activities-collapse`);
    expect(activitiesCollapse).not.toBeInTheDocument();

    expect(screen.queryAllByTestId(activitiesRegex)).toHaveLength(3);

    // check all to be unchecked by default
    const activities = screen.queryAllByTestId(activitiesRegex);
    activities.forEach((activity) => {
      const checkbox = activity.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toHaveAttribute('checked');
    });

    const addToCartButton = screen.getByTestId(`${dataTestid}-add-to-cart`);
    expect(addToCartButton).toBeDisabled();

    // check first one
    const activity0Checkbox = activities[0].querySelector('input[type="checkbox"]');
    await userEvent.click(activity0Checkbox);

    expect(activity0Checkbox).toBeChecked();
    expect(addToCartButton).not.toBeDisabled();

    await userEvent.click(addToCartButton);

    expect(addAppletToCartMock).toHaveBeenCalledWith([mockApplet]);
  });

  test('renders applet information for uiType = Cart, remove applet from the cart', async () => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);

    renderWithProviders(
      <Applet
        applet={mockApplet}
        uiType={AppletUiType.Cart}
        data-testid={dataTestid}
        setSearch={mockSetSearch}
      />,
      {
        route: '/library/cart',
        routePath: page.libraryCart,
        preloadedState,
      },
    );

    const activitiesRegex = new RegExp(`${dataTestid}-activities-\\d+$`);
    const activitiesCollapse = screen.getByTestId(`${dataTestid}-activities-collapse`);
    expect(activitiesCollapse).toBeInTheDocument();

    expect(screen.queryAllByTestId(activitiesRegex)).toHaveLength(3);

    const removePopup = screen.queryByTestId(`${dataTestid}-remove-popup`);
    expect(removePopup).not.toBeInTheDocument();

    const removeButton = screen.getByTestId(`${dataTestid}-cart-remove`);
    expect(removeButton).not.toBeDisabled();
    await userEvent.click(removeButton);

    expect(screen.getByTestId(`${dataTestid}-remove-popup`)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to to remove Applet/)).toBeInTheDocument();

    const confirmButton = screen.getByTestId(`${dataTestid}-remove-popup-submit-button`);
    expect(confirmButton).toBeInTheDocument();
    await userEvent.click(confirmButton);

    expect(screen.queryByTestId(`${dataTestid}-remove-popup`)).not.toBeInTheDocument();
  });
});
