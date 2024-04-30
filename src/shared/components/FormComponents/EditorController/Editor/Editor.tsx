import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import 'md-editor-rt/lib/style.css';

import {
  CharacterCounter,
  FooterMessage,
  LANGUAGE_BY_DEFAULT,
} from 'shared/components/MarkDownEditor';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { StyledFlexColumn, StyledFlexSpaceBetween, theme } from 'shared/styles';
import { getSanitizedContent } from 'shared/utils/forms';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';

import { StyledMdEditor } from './Editor.styles';
import { getCustomIcons, getDefToolbars, getToolbars } from './Editor.utils';
import { EditorProps } from './Editor.types';

export const Editor = ({
  editorId,
  editorRef,
  value,
  onChange,
  onInsert,
  onFileExceeded,
  onIncorrectFileFormat,
  uiType,
  error,
  disabled,
  withDebounce,
  'data-testid': dataTestid,
}: EditorProps) => {
  const { t } = useTranslation('app');
  const [inputValue, setInputValue] = useState(value ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const focusedRef = useRef(false);
  const shouldSkipDebounceChange = useMemo(
    () => !withDebounce || inputValue === value,
    [inputValue, value, withDebounce],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedChange = useCallback(
    debounce((value: string) => onChange(value), CHANGE_DEBOUNCE_VALUE),
    [],
  );

  const handleChange = useMemo(
    () => (withDebounce ? setInputValue : onChange),
    [onChange, withDebounce],
  );

  const handleBlur = useCallback(() => {
    focusedRef.current = false;
    if (shouldSkipDebounceChange) return;

    handleDebouncedChange.cancel();
    onChange(inputValue);
  }, [shouldSkipDebounceChange, handleDebouncedChange, inputValue, onChange]);

  const handleFocus = useCallback(() => {
    focusedRef.current = true;
  }, []);

  useEffect(() => {
    if (shouldSkipDebounceChange) return;

    handleDebouncedChange(inputValue);
  }, [shouldSkipDebounceChange, inputValue, handleDebouncedChange]);

  useEffect(() => {
    if (focusedRef.current || shouldSkipDebounceChange) return;

    setInputValue(value ?? '');
    handleDebouncedChange.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <StyledFlexColumn sx={{ position: 'relative' }} data-testid={dataTestid}>
      <StyledMdEditor
        sanitize={(content: string) => getSanitizedContent(content)}
        editorId={editorId}
        className={`${uiType} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
        ref={editorRef}
        modelValue={withDebounce ? inputValue : value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        language={LANGUAGE_BY_DEFAULT}
        disabled={disabled}
        placeholder={t('textPlaceholder')}
        defToolbars={getDefToolbars({
          onInsert,
          onChange,
          setFileSizeExceeded: onFileExceeded,
          setIncorrectFormat: onIncorrectFileFormat,
          setIsLoading,
        })}
        customIcon={getCustomIcons()}
        toolbars={getToolbars()}
        footers={[]}
      />
      <StyledFlexSpaceBetween sx={{ m: theme.spacing(0.4, 0, 2) }}>
        <FooterMessage inputSize={(value ?? '').length} key="footer-message" error={error} />
        {!error?.message && (
          <CharacterCounter
            inputSize={(value ?? '').length}
            disabled={disabled}
            key="character-counter"
          />
        )}
      </StyledFlexSpaceBetween>
      {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
    </StyledFlexColumn>
  );
};
