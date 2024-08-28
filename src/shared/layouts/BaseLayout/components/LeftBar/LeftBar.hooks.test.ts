import { enableIntegrationApi } from 'modules/Dashboard/api';
import { useAsync } from 'shared/hooks/useAsync';
import { renderHookWithProviders } from 'shared/utils/renderHookWithProviders';

import { useIntegrationToggle } from './LeftBar.hooks';

jest.mock('modules/Dashboard/api');
jest.mock('shared/hooks/useAsync');

describe('useIntegrationToggle', () => {
  let enableIntegration: jest.Mock;
  let disableIntegration: jest.Mock;

  beforeEach(() => {
    enableIntegration = jest.fn();
    disableIntegration = jest.fn();

    (useAsync as jest.Mock).mockImplementation((apiFunction) => ({
      execute: apiFunction === enableIntegrationApi ? enableIntegration : disableIntegration,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should enable integration if not present and feature flag is true', async () => {
    const currentWorkspaceData = {
      ownerId: 'testOwnerId',
      workspaceName: 'testWorkspaceName',
    };
    const featureFlags = { 'enable-loris-integration': true };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(enableIntegration).toHaveBeenCalledWith([{ integrationType: 'LORIS' }]);
    expect(disableIntegration).not.toHaveBeenCalled();
  });

  test('should disable integration if present and feature flag is false', async () => {
    const currentWorkspaceData = {
      ownerId: 'testOwnerId',
      workspaceName: 'testWorkspaceName',
      integrations: [{ integrationType: 'LORIS' }],
    };
    const featureFlags = { 'enable-loris-integration': false };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(disableIntegration).toHaveBeenCalledWith(['LORIS']);
    expect(enableIntegration).not.toHaveBeenCalled();
  });

  test('should do nothing if feature flags are not loaded', async () => {
    const currentWorkspaceData = {
      ownerId: 'testOwnerId',
      workspaceName: 'testWorkspaceName',
    };
    const featureFlags = { 'enable-loris-integration': false };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(enableIntegration).not.toHaveBeenCalled();
    expect(disableIntegration).not.toHaveBeenCalled();
  });

  test('should do nothing if currentWorkspaceData is null', async () => {
    const featureFlags = { 'enable-loris-integration': true };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData: null,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(enableIntegration).not.toHaveBeenCalled();
    expect(disableIntegration).not.toHaveBeenCalled();
  });

  test('should do nothing if integration already present and feature flag is true', async () => {
    const currentWorkspaceData = {
      ownerId: 'testOwnerId',
      workspaceName: 'testWorkspaceName',
      integrations: [{ integrationType: 'LORIS' }],
    };
    const featureFlags = { 'enable-loris-integration': true };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(enableIntegration).not.toHaveBeenCalled();
    expect(disableIntegration).not.toHaveBeenCalled();
  });

  test('should do nothing if integration not present and feature flag is false', async () => {
    const currentWorkspaceData = {
      ownerId: 'testOwnerId',
      workspaceName: 'testWorkspaceName',
    };
    const featureFlags = { testIntegration: false };

    renderHookWithProviders(() =>
      useIntegrationToggle({
        integrationType: 'LORIS',
        currentWorkspaceData,
        areFeatureFlagsLoaded: true,
        featureFlags,
      }),
    );

    expect(enableIntegration).not.toHaveBeenCalled();
    expect(disableIntegration).not.toHaveBeenCalled();
  });
});
