// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as reduxHooks from 'redux/store/hooks';
import { library } from 'redux/modules';
import { renderWithProviders } from 'shared/utils';
import { SEARCH_DEBOUNCE_VALUE } from 'shared/consts';

import { AppletsCatalog } from './AppletsCatalog';

const mockDispatch = () => Promise.resolve('');
const mockUseNavigate = jest.fn();

const mockPublishedApplets = {
  count: 16,
  result: [
    {
      id: 'd8c5096c-e9f0-454f-b757-67a1d60fdcdf',
      displayName: 'Applet Share Test 1',
      description: {
        en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa.',
      },
      image: '',
      keywords: ['keyword1', 'applet test keyword'],
      activities: [],
      version: '1.1.1',
    },
    {
      id: 'e2d6c55f-4286-437f-9620-9b992da15912',
      displayName: 'Applet Share Test 2',
      description: {
        en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa.',
      },
      image: '',
      themeId: null,
      keywords: ['keyword 1', 'test share', 'new share'],
      activities: [],
      version: '3.9.2',
    },
    {
      id: '03c397b4-be35-48ea-b7c2-dcf4296b3b4a',
      displayName: 'Applet Share Test 3',
      description: {
        en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa.',
      },
      image: '',
      keywords: ['keyword 1'],
      activities: [],
      version: '1.1.1',
    },
    {
      id: '3bd7ff68-9ea3-4918-a614-5f8a07480ac9',
      displayName: 'Applet Share Test 4',
      description: {
        en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in lorem massa.',
      },
      image: '',
      keywords: ['keyword 1'],
      activities: [],
      version: '1.0.9',
    },
    {
      id: 'b4a4268c-0bd1-4788-80ef-ba8cc43afedf',
      displayName: 'Applet Share Test 5',
      description: {
        en: 'Description',
      },
      image: '',
      keywords: ['keyword 1', 'keyword 2'],
      activities: [],
      version: '1.1.0',
    },
    {
      id: '4e76faca-45d1-4bf6-9c2f-26572aa79c8a',
      displayName: 'Applet Share Test 6',
      description: {
        en: 'Description',
      },
      image: '',
      keywords: ['library'],
      activities: [],
      version: '1.1.0',
    },
  ],
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

jest.mock('redux/store/hooks', () => ({
  ...jest.requireActual('redux/store/hooks'),
  useAppDispatch: jest.fn(),
}));

jest.mock('modules/Library/hooks', () => ({
  ...jest.requireActual('modules/Library/hooks'),
  useAppletsFromCart: jest.fn(),
  useReturnToLibraryPath: jest.fn(),
}));

describe('AppletsCatalog', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(library.thunk, 'getPublishedApplets').mockReturnValue(() => {});
  });

  test('renders loading spinner when applets are loading', () => {
    const spyGetPublishedApplets = jest.spyOn(library.thunk, 'getPublishedApplets');
    jest.spyOn(library, 'usePublishedApplets').mockReturnValue({ count: 0, result: [] });
    jest.spyOn(library, 'usePublishedAppletsStatus').mockReturnValue('loading');
    jest.spyOn(library, 'useCartAppletsStatus').mockReturnValue('loading');

    renderWithProviders(<AppletsCatalog />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(spyGetPublishedApplets).toHaveBeenCalledWith({ limit: 6, page: 1, search: '' });
  });

  test('renders applets and pagination correctly when applets are loaded', async () => {
    const spyGetPublishedApplets = jest.spyOn(library.thunk, 'getPublishedApplets');
    jest.spyOn(library, 'usePublishedApplets').mockReturnValue(mockPublishedApplets);
    jest.spyOn(library, 'usePublishedAppletsStatus').mockReturnValue('idle');
    jest.spyOn(library, 'useCartAppletsStatus').mockReturnValue('idle');

    renderWithProviders(<AppletsCatalog />);

    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    expect(spyGetPublishedApplets).toHaveBeenCalledWith({ limit: 6, page: 1, search: '' });

    expect(screen.queryAllByTestId(/library-applets-\d+$/)).toHaveLength(6);
    expect(screen.getByTestId('library-applets-pagination')).toBeInTheDocument();

    expect(screen.getByText('1–6 of 16'));
    const nextPageButton = screen.getByRole('button', { name: 'Go to next page' });
    await userEvent.click(nextPageButton);

    expect(spyGetPublishedApplets).toHaveBeenCalledWith({ limit: 6, page: 2, search: '' });

    const searchContainer = screen.getByTestId('library-search');
    expect(searchContainer).toBeInTheDocument();
    const searchInput = searchContainer.querySelector('input');

    await userEvent.type(searchInput, 'share test 1');
    await new Promise((resolve) => setTimeout(resolve, SEARCH_DEBOUNCE_VALUE));

    expect(spyGetPublishedApplets).toHaveBeenCalledWith({
      limit: 6,
      page: 1,
      search: 'share test 1',
    });

    const cartButton = screen.getByTestId('library-cart-button');
    expect(cartButton).toBeInTheDocument();

    await userEvent.click(cartButton);

    expect(mockUseNavigate).toHaveBeenCalledWith('/library/cart');
  });
});
