/**
 * Tests for useMFAInputHandler hook
 * This hook handles input sanitization for MFA verification codes
 */

import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useMFAInputHandler } from './useMFAInputHandler';

describe('useMFAInputHandler', () => {
  // Create mock functions for the hook's dependencies
  let mockSetVerificationCode: ReturnType<typeof vi.fn>;
  let mockClearError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test to ensure clean state
    mockSetVerificationCode = vi.fn();
    mockClearError = vi.fn();
  });

  /**
   * Helper function to create mock input event
   * This simulates what happens when a user types in an input field
   */
  const createInputEvent = (value: string): React.ChangeEvent<HTMLInputElement> =>
    ({
      target: { value },
    }) as React.ChangeEvent<HTMLInputElement>;

  describe('digit filtering', () => {
    test('should filter out non-digit characters', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      // Test letters, special chars, and spaces are all filtered
      const event = createInputEvent('a1b2-3 4!5@6');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('123456');
    });

    test('should handle empty input', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      const event = createInputEvent('');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('');
    });

    test('should return empty string when input has only non-digits', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      const event = createInputEvent('abc-!@#');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('');
    });
  });

  describe('length limiting', () => {
    test('should reject input exceeding 6 digits', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      const event = createInputEvent('12345678');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).not.toHaveBeenCalled();
    });

    test('should reject input exceeding 6 digits after filtering non-digits', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      // After filtering: 12345678 (8 digits) exceeds limit
      const event = createInputEvent('1a2b3c4d5e6f7g8h');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).not.toHaveBeenCalled();
    });

    test('should accept input with exactly 6 digits after filtering', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      // After filtering: 123456 (6 digits) is acceptable
      const event = createInputEvent('1-2-3-4-5-6');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('123456');
    });

    test('should accept input with fewer than 6 digits', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      const event = createInputEvent('123');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('123');
    });
  });

  describe('error clearing behavior', () => {
    test('should clear error when typing if error exists', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, 'Invalid code'),
      );

      const event = createInputEvent('1');
      result.current.handleInputChange(event);

      expect(mockClearError).toHaveBeenCalled();
    });

    test('should not clear error when no error exists', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      const event = createInputEvent('1');
      result.current.handleInputChange(event);

      expect(mockClearError).not.toHaveBeenCalled();
    });
  });

  describe('combined operations', () => {
    test('should filter non-digits and clear error simultaneously', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, 'Invalid code'),
      );

      const event = createInputEvent('1a2b3c');
      result.current.handleInputChange(event);

      expect(mockSetVerificationCode).toHaveBeenCalledWith('123');
      expect(mockClearError).toHaveBeenCalled();
    });

    test('should handle progressive typing to build complete code', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      // Simulate realistic user typing one digit at a time
      result.current.handleInputChange(createInputEvent('1'));
      result.current.handleInputChange(createInputEvent('12'));
      result.current.handleInputChange(createInputEvent('123'));
      result.current.handleInputChange(createInputEvent('1234'));
      result.current.handleInputChange(createInputEvent('12345'));
      result.current.handleInputChange(createInputEvent('123456'));

      expect(mockSetVerificationCode).toHaveBeenCalledTimes(6);
      expect(mockSetVerificationCode).toHaveBeenLastCalledWith('123456');
    });

    test('should block further input after reaching 6 digits', () => {
      const { result } = renderHook(() =>
        useMFAInputHandler(mockSetVerificationCode, mockClearError, null),
      );

      result.current.handleInputChange(createInputEvent('123456'));
      mockSetVerificationCode.mockClear();

      // Attempt to add 7th digit
      result.current.handleInputChange(createInputEvent('1234567'));

      expect(mockSetVerificationCode).not.toHaveBeenCalled();
    });
  });
});
