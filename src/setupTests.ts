import 'mock-local-storage';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('react-secure-storage', () => ({
  default: {
  setItem: vi.fn(() => Promise.resolve()),
  getItem: vi.fn(() => Promise.resolve('')),
  removeItem: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('shared/utils/encryption', async () => ({
  __esModule: true,
  ...(await vi.importActual('shared/utils/encryption')),
}));

vi.spyOn(global.console, 'warn').mockImplementation((message) => {
  if (typeof message === 'string' && message.includes('You have provided an out-of-range value'))
    return;

  return message;
});

vi.spyOn(global.console, 'error').mockImplementation((message) => {
  if (
    typeof message === 'string' &&
    (message.includes('A component is changing an uncontrolled input to be controlled') ||
      message.includes('`children` must be passed'))
  )
    return;

  return message;
});

vi.mock('shared/components/FormComponents/EditorController/Editor/Editor.styles', async () => {
  const actual = await vi.importActual<typeof import('./__mocks__/EditorController')>(
    './__mocks__/EditorController',
  );

  return {
    StyledMdEditor: actual.StyledMdEditor,
  };
});

vi.mock('axios', () => {
  const mockPost = vi.fn();
  const mockGet = vi.fn();
  const mockDelete = vi.fn();
  const mockPut = vi.fn();
  const mockIsAxiosError = vi.fn();

  return {
    default: {
      create: () => ({ post: mockPost, get: mockGet, delete: mockDelete, put: mockPut }),
      post: mockPost,
      get: mockGet,
      delete: mockDelete,
      put: mockPut,
      isAxiosError: mockIsAxiosError,
    },
  };
});

// Global mock for useFeatureFlags - Vitest requires this due to different hoisting behavior than Jest
// In Jest (develop branch), individual test mocks work without a global mock due to automatic hoisting
// In Vitest, we need a default implementation to prevent "Cannot destructure" errors
vi.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: vi.fn(() => ({
    featureFlags: {
      enableActivityAssign: true,
      enableParticipantMultiInformant: true,
    },
    resetLDContext: vi.fn(),
  })),
}));
