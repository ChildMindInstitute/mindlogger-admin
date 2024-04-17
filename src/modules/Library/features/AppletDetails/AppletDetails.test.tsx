import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { library } from 'redux/modules';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId } from 'shared/mock';
import { page } from 'resources';

import { AppletDetails } from './AppletDetails';

const mockUseNavigate = jest.fn();

const route = `/library/${mockedAppletId}`;
const routePath = page.libraryAppletDetails;

const mockAppletDetails = {
  id: 'd8c5096c-e9f0-454f-b757-67a1d60fdcdf',
  displayName: 'Applet Share Test',
  description: {
    en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  image: '',
  keywords: ['keyword1', 'keyword2'],
  activities: [
    {
      key: 'f2e14fd8-cd7a-4bf0-8e0f-39f77df1e0f0',
      name: 'New Activity 1',
      description: {
        en: '',
      },
      isPerformanceTask: false,
      items: [
        {
          question: {
            en: 'Item 1',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                text: 'Option 1',
              },
              {
                text: 'Option 2',
              },
            ],
          },
          name: 'Item1',
        },
      ],
    },
    {
      key: '1c7c5cfa-e277-4cdb-9233-a3abf66f5b5f',
      name: 'New Activity 2',
      description: {
        en: '',
      },
      isPerformanceTask: false,
      items: [
        {
          question: {
            en: 'Item 2',
          },
          responseType: 'singleSelect',
          responseValues: {
            options: [
              {
                text: 'Option 1',
              },
              {
                text: 'Option 2',
              },
            ],
          },
          name: 'Item2',
        },
      ],
    },
    {
      key: '2b5bbfca-f129-4da3-9a88-424fe82ce3b5',
      name: 'CST Touch',
      description: {
        en: 'This Activity contains Stability Tracker (Touch) Item.',
      },
      isPerformanceTask: true,
      performanceTaskType: 'touch',
      items: [],
    },
  ],
  activityFlows: [],
  version: '1.1.1',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('modules/Library/hooks', () => ({
  ...jest.requireActual('modules/Library/hooks'),
  useAppletsFromCart: jest.fn(),
  useReturnToLibraryPath: jest.fn(),
}));

describe('AppletDetails', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when cart applets are loading', () => {
    jest.spyOn(library, 'useCartAppletsStatus').mockReturnValue('loading');
    renderWithProviders(<AppletDetails />, { route, routePath });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('renders details and buttons when cart applets are loaded', async () => {
    jest.spyOn(library, 'useCartAppletsStatus').mockReturnValue('idle');

    mockAxios.get.mockResolvedValueOnce({
      data: {
        result: mockAppletDetails,
      },
    });

    renderWithProviders(<AppletDetails />, { route, routePath });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenNthCalledWith(1, `/library/${mockedAppletId}`, {
        signal: undefined,
      });
    });

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

    const backButton = screen.getByTestId('library-back-button');
    expect(backButton).toBeInTheDocument();

    const cartButton = screen.getByTestId('library-cart-button');
    expect(cartButton).toBeInTheDocument();

    await userEvent.click(cartButton);

    expect(mockUseNavigate).toHaveBeenCalledWith('/library/cart');
  });
});
