import 'mock-local-storage';
import '@testing-library/jest-dom';

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
