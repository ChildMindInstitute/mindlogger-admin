import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import {
  CharacterCounter,
  FooterMessage,
  LANGUAGE_BY_DEFAULT,
} from 'shared/components/MarkDownEditor';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { StyledFlexColumn, StyledFlexSpaceBetween, theme } from 'shared/styles';
import { getSanitizedContent } from 'shared/utils/forms';

import { StyledMdEditor } from './Editor.styles';
import { fixAngleBrackets, getCustomIcons, getDefToolbars, getToolbars } from './Editor.utils';
import { EditorProps } from './Editor.types';
import { useDebounceInputLogic } from './Editor.hooks';

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
  placeholder,
  'data-testid': dataTestid,
}: EditorProps) => {
  const { t } = useTranslation('app');
  const [isLoading, setIsLoading] = useState(false);
  const { inputValue, handleChange, handleBlur, handleFocus } = useDebounceInputLogic({
    value,
    onChange,
    withDebounce,
  });

  /* Replace encoded angle brackets (&lt;, &gt;) with their respective symbols (<, >).
   This fix is necessary because the backend encodes these characters, but they must
   be plain text for proper quote formatting. */
  const modelValue = useMemo(
    () => fixAngleBrackets(withDebounce ? inputValue : value ?? ''),
    [withDebounce, inputValue, value],
  );

  return (
    <StyledFlexColumn sx={{ position: 'relative' }} data-testid={dataTestid}>
      <StyledMdEditor
        sanitize={(content: string) => getSanitizedContent(content)}
        editorId={editorId}
        className={`${uiType} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
        ref={editorRef}
        modelValue={modelValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        language={LANGUAGE_BY_DEFAULT}
        disabled={disabled}
        placeholder={placeholder ?? t('textPlaceholder')}
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
