// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { library } from 'redux/modules';
import { getAppletsFromStorage } from 'modules/Library/utils';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import * as reduxHooks from 'redux/store/hooks';

import { useAppletsFromCart } from './useAppletsFromCart';

const getPreloadedState = ({ isAuthorized }) => ({
  auth: {
    isAuthorized,
  },
});

const mockDispatch = vi.fn();
const mockPostAppletsToCart = vi.fn();

vi.mock('redux/store/hooks', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useAppDispatch: vi.fn(),
  };
});

vi.mock('modules/Library/utils', () => ({
  getAppletsFromStorage: vi.fn(),
}));

describe('useAppletsFromCart', () => {
  const mockApplets = [
    { id: '1', name: 'Applet 1' },
    { id: '2', name: 'Applet 2' },
  ];

  beforeEach(() => {
    vi.spyOn(reduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    vi.spyOn(library.thunk, 'postAppletsToCart').mockReturnValue(mockPostAppletsToCart);
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  test('should call postAppletsToCart if authorized with applets from storage', async () => {
    getAppletsFromStorage.mockReturnValue(mockApplets);

    const { result } = renderHookWithProviders(useAppletsFromCart, {
      preloadedState: getPreloadedState({ isAuthorized: true }),
    });

    expect(result.current).toEqual({ appletsFromStorage: mockApplets });
    expect(mockDispatch).toHaveBeenCalledWith(mockPostAppletsToCart);
  });

  test('should dispatch setAppletsFromStorage action if not authorized with applets from storage', async () => {
    getAppletsFromStorage.mockReturnValue(mockApplets);

    const { result } = renderHookWithProviders(useAppletsFromCart, {
      preloadedState: getPreloadedState({ isAuthorized: false }),
    });

    expect(result.current).toEqual({ appletsFromStorage: mockApplets });
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: mockApplets,
      type: 'library/setAppletsFromStorage',
    });
  });
});
