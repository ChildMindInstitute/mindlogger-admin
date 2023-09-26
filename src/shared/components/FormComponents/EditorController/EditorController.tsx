import { useCallback, useRef, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import {
  CharacterCounter,
  FooterMessage,
  LANGUAGE_BY_DEFAULT,
} from 'shared/components/MarkDownEditor';
import { FileSizeExceededPopup } from 'shared/components/MarkDownEditor/FileSizeExceededPopup';
import { IncorrectFilePopup } from 'shared/components/IncorrectFilePopup';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { MediaType, UploadFileError } from 'shared/consts';
import { StyledFlexColumn, StyledFlexSpaceBetween, theme } from 'shared/styles';
import { concatIf } from 'shared/utils/concatIf';
import { getSanitizedContent } from 'shared/utils/forms';

import { StyledMdEditor } from './EditorController.styles';
import { EditorControllerProps, EditorUiType } from './EditorController.types';
import { getCustomIcons, getDefToolbars, getToolbars } from './EditorController.utils';

export const EditorController = <T extends FieldValues>({
  name,
  control,
  uiType = EditorUiType.Primary,
  editorId,
  disabled = false,
  'data-testid': dataTestid,
}: EditorControllerProps<T>) => {
  const { t } = useTranslation('app');
  const editorRef = useRef<ExposeParam>();
  const [fileSizeExceeded, setFileSizeExceeded] = useState<number | null>(null);
  const [incorrectFileFormat, setIncorrectFileFormat] = useState<MediaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <StyledFlexColumn sx={{ position: 'relative' }} data-testid={dataTestid}>
            <StyledMdEditor
              sanitize={(content: string) => getSanitizedContent(content)}
              editorId={editorId}
              className={`${uiType} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
              ref={editorRef}
              modelValue={value ?? ''}
              onChange={onChange}
              language={LANGUAGE_BY_DEFAULT}
              disabled={disabled}
              placeholder={t('textPlaceholder')}
              defToolbars={getDefToolbars({
                onInsert,
                onChange,
                setFileSizeExceeded,
                setIncorrectFormat: setIncorrectFileFormat,
                setIsLoading,
              })}
              customIcon={getCustomIcons()}
              toolbars={getToolbars()}
              footers={[]}
            />
            <StyledFlexSpaceBetween sx={{ m: theme.spacing(0.4, 0, 2) }}>
              <FooterMessage inputSize={(value ?? '').length} key="footer-message" error={error} />
              {!error?.message && (
                <CharacterCounter inputSize={(value ?? '').length} key="character-counter" />
              )}
            </StyledFlexSpaceBetween>
            {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
          </StyledFlexColumn>
        )}
      />
      {!!fileSizeExceeded && (
        <FileSizeExceededPopup
          popupVisible={!!fileSizeExceeded}
          size={fileSizeExceeded}
          onClose={() => setFileSizeExceeded(null)}
          data-testid={concatIf(dataTestid, '-incorrect-file-size-popup')}
        />
      )}
      {incorrectFileFormat && (
        <IncorrectFilePopup
          popupVisible={!!incorrectFileFormat}
          onClose={() => setIncorrectFileFormat(null)}
          uiType={UploadFileError.Format}
          fileType={incorrectFileFormat}
          data-testid={concatIf(dataTestid, '-incorrect-file-format-popup')}
        />
      )}
    </>
  );
};
