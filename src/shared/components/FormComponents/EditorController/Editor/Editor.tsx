import { useState, useEffect, useCallback } from 'react';

import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import { CharacterCounter, FooterMessage, LANGUAGE_BY_DEFAULT } from 'shared/components/MarkDownEditor';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { CHANGE_DEBOUNCE_VALUE } from 'shared/consts';
import { StyledFlexColumn, StyledFlexSpaceBetween, theme } from 'shared/styles';
import { getSanitizedContent } from 'shared/utils/forms';

import { StyledMdEditor } from './Editor.styles';
import { EditorProps } from './Editor.types';
import { getCustomIcons, getDefToolbars, getToolbars } from './Editor.utils';

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

  const handleDebouncedChange = useCallback(
    debounce((value: string) => onChange(value), CHANGE_DEBOUNCE_VALUE),
    [],
  );

  useEffect(() => {
    if (!withDebounce || inputValue === value) return;

    handleDebouncedChange(inputValue);
  }, [inputValue, value, withDebounce]);

  useEffect(() => {
    if (!withDebounce) return;

    setInputValue(value ?? '');
    handleDebouncedChange.cancel();
  }, [value]);

  const handleChange = withDebounce ? setInputValue : onChange;
  const handleBlur = () => {
    if (withDebounce && value !== inputValue) {
      onChange(inputValue);
    }
  };

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
          <CharacterCounter inputSize={(value ?? '').length} disabled={disabled} key="character-counter" />
        )}
      </StyledFlexSpaceBetween>
      {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
    </StyledFlexColumn>
  );
};
