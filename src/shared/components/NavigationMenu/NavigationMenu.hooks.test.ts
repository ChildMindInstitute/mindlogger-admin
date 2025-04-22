// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';
import { page } from 'resources';
import { mockedAppletId } from 'shared/mock';

import { useSettingsRedirection } from './NavigationMenu.hooks';

const mockUseNavigate = vi.fn();
const items = [
  { label: 'Users and data', items: [{ label: 'Data retention', param: 'data-retention' }] },
  { label: 'Applet content', items: [] },
];
const getPreloadedState = (status: 'loading' | 'success') => ({
  workspaces: {
    roles: {
      status,
    },
  },
  applet: {
    applet: {
      status,
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

jest.mock('shared/hooks/useCheckIfNewApplet', () => ({
  useCheckIfNewApplet: vi.fn(),
}));

describe('useSettingsRedirection', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  test('no redirect if status is loading and items is an empty array', () => {
    renderHookWithProviders(() => useSettingsRedirection([]), {
      preloadedState: getPreloadedState('loading'),
      route: `/dashboard/${mockedAppletId}/settings/data-retention`,
      routePath: page.appletSettingsItem,
    });

    expect(mockUseNavigate).not.toHaveBeenCalled();
  });

  test('no redirect if status is success and items is an non-empty array', () => {
    renderHookWithProviders(() => useSettingsRedirection(items), {
      preloadedState: getPreloadedState('success'),
      route: `/dashboard/${mockedAppletId}/settings/data-retention`,
      routePath: page.appletSettingsItem,
    });

    expect(mockUseNavigate).not.toHaveBeenCalled();
  });

  test("redirects if status is success and param isn't an active item ", () => {
    renderHookWithProviders(() => useSettingsRedirection(items), {
      preloadedState: getPreloadedState('success'),
      route: `/dashboard/${mockedAppletId}/settings/export-data`,
      routePath: page.appletSettingsItem,
    });

    expect(mockUseNavigate).toHaveBeenCalledTimes(1);
  });
});
