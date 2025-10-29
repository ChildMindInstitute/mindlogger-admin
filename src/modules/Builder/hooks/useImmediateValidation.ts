import { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Optimized validation hook that debounces uniqueness validation
 * to prevent performance issues in large applets
 */
export const useImmediateValidation = (fieldName: string) => {
  const formContext = useFormContext();
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, applyChange: () => void) => {
      const value = event.target.value;

      applyChange();

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      if (!value || value.trim() === '') {
        // Clear errors immediately and trigger validation asynchronously for empty fields
        formContext.clearErrors(fieldName);
        setTimeout(() => formContext.trigger(fieldName), 0);
      } else {
        formContext.clearErrors(fieldName);
        // Debounce uniqueness validation for performance
        debounceTimeoutRef.current = setTimeout(() => {
          formContext.trigger(fieldName);
        }, 500);
      }
    },
    [fieldName, formContext],
  );

  return handleChange;
};
