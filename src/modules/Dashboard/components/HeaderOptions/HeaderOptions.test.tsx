import { fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedApplet, mockedCurrentWorkspace } from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { useFeatureFlags } from 'shared/hooks';

import { HeaderOptions } from './HeaderOptions';

const testAppletId = 'testAppletId';

const getPreloadedState = (role: Roles = Roles.Manager) => ({
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [testAppletId]: [role],
      },
    },
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
});

const mockUseNavigate = vi.fn();

// mock the module
vi.mock('react-router-dom', async () => {
  // pull in the real implementation
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
    useParams: () => ({ appletId: 'testAppletId' }),
  };
});

describe('HeaderOptions', () => {
  beforeEach(() => {
    renderWithProviders(<HeaderOptions />, { preloadedState: getPreloadedState() });
  });

  test('should open Export options menu when export button is pressed', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));

    expect(screen.queryByTestId('header-option-export-menu')).toBeInTheDocument();
  });

  test('should see Response Data option in export options menu', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));

    expect(screen.queryByTestId('header-option-response-data-button')).toBeInTheDocument();
  });

  test('should see Audit Logs option in export options menu', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));

    expect(screen.queryByTestId('header-option-audit-logs-button')).toBeInTheDocument();
  });

  test('should contain link to settings page', () => {
    expect(screen.getByTestId('header-option-settings-link')).toHaveAttribute(
      'href',
      `/dashboard/${testAppletId}/settings`,
    );
  });
});

describe('HeaderOptions show or hide depending on role', () => {
  test.each`
    canEdit  | canAccessData | role                 | description
    ${true}  | ${true}       | ${Roles.Manager}     | ${'header for Manager'}
    ${true}  | ${true}       | ${Roles.SuperAdmin}  | ${'header for SuperAdmin'}
    ${true}  | ${true}       | ${Roles.Owner}       | ${'header for Owner'}
    ${false} | ${false}      | ${Roles.Coordinator} | ${'header for Coordinator'}
    ${true}  | ${false}      | ${Roles.Editor}      | ${'header for Editor'}
    ${false} | ${false}      | ${Roles.Respondent}  | ${'header for Respondent'}
    ${false} | ${true}       | ${Roles.Reviewer}    | ${'header for Reviewer'}
  `('$description', async ({ canEdit, canAccessData, role }) => {
    renderWithProviders(<HeaderOptions />, {
      preloadedState: getPreloadedState(role),
    });

    const settingsButtons = screen.queryAllByTestId('header-option-settings-link');
    canEdit
      ? expect(settingsButtons.length).toBeGreaterThan(0)
      : expect(settingsButtons.length).toBe(0);

    const exportButtons = screen.queryAllByTestId('header-option-export-button');
    canAccessData
      ? expect(exportButtons.length).toBeGreaterThan(0)
      : expect(exportButtons.length).toBe(0);
  });
});

describe('HeaderOptions show or hide depending on feature flag', () => {
  beforeEach(() => {
    vi.mocked(useFeatureFlags).mockReturnValue({
      featureFlags: { enableAuditLogs: false },
      resetLDContext: vi.fn(),
    });
    renderWithProviders(<HeaderOptions />, { preloadedState: getPreloadedState() });
  });

  afterEach(() => {
    vi.mocked(useFeatureFlags).mockReset();
  });

  test('header for enableAuditLogs off', () => {
    fireEvent.click(screen.getByTestId('header-option-export-button'));
    expect(screen.queryByTestId('header-option-response-data-button')).toBeInTheDocument();
    expect(screen.queryByTestId('header-option-audit-logs-button')).not.toBeInTheDocument();
  });
});
