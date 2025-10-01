import 'mock-local-storage';
import '@testing-library/jest-dom';

// Mock ResizeObserver
const mockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.ResizeObserver = mockResizeObserver;

// Also set prototype methods
Object.setPrototypeOf(mockResizeObserver.prototype, {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

jest.mock('react-secure-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('')),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('shared/utils/encryption', () => ({
  __esModule: true,
  ...jest.requireActual('shared/utils/encryption'),
}));

jest.spyOn(global.console, 'warn').mockImplementation((message) => {
  if (message?.includes('You have provided an out-of-range value')) return;

  return message;
});

jest.spyOn(global.console, 'error').mockImplementation((message) => {
  if (
    message?.includes('A component is changing an uncontrolled input to be controlled') ||
    message?.includes('`children` must be passed')
  )
    return;

  return message;
});

jest.mock('shared/components/FormComponents/EditorController/Editor/Editor.styles', () => ({
  ...jest.requireActual('__mocks__/EditorController'),
}));
