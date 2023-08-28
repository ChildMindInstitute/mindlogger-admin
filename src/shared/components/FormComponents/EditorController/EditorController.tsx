import { useCallback, useRef, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import {
  AlignTextExtension,
  AudioUploadExtension,
  CharacterCounter,
  FooterMessage,
  ImageUploadExtension,
  LANGUAGE_BY_DEFAULT,
  MarkExtension,
  StrikethroughExtension,
  SubscriptExtension,
  SuperscriptExtension,
  TrashExtension,
  UnderlineExtension,
  VideoUploadExtension,
} from 'shared/components/MarkDownEditor';
import { FileSizeExceededPopup } from 'shared/components/MarkDownEditor/FileSizeExceededPopup';
import { IncorrectFilePopup } from 'shared/components/IncorrectFilePopup';
import { Spinner, SpinnerUiType } from 'shared/components/Spinner';
import { MAX_FILE_SIZE_150MB, MAX_FILE_SIZE_25MB, MediaType, UploadFileError } from 'shared/consts';
import { StyledFlexColumn } from 'shared/styles';
import { concatIf } from 'shared/utils';

import { StyledErrorText, StyledMdEditor } from './EditorController.styles';
import { EditorControllerProps, EditorUiType } from './EditorController.types';

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

  const commonMediaProps = {
    onInsert,
    setFileSizeExceeded,
    setIncorrectFormat: setIncorrectFileFormat,
    setIsLoading,
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <StyledFlexColumn sx={{ position: 'relative' }} data-testid={dataTestid}>
            <StyledMdEditor
              editorId={editorId}
              className={`${uiType} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
              ref={editorRef}
              modelValue={value ?? ''}
              onChange={onChange}
              language={LANGUAGE_BY_DEFAULT}
              disabled={disabled}
              placeholder={t('textPlaceholder')}
              defToolbars={[
                <MarkExtension key="mark-extension" onInsert={onInsert} />,
                <TrashExtension
                  key="trash-extension"
                  onClick={() => {
                    onChange('');
                  }}
                />,
                <AlignTextExtension
                  key="align-left-extension"
                  type="left"
                  title={t('alignLeft')}
                  onInsert={onInsert}
                />,
                <AlignTextExtension
                  key="align-center-extension"
                  type="center"
                  title={t('alignCenter')}
                  onInsert={onInsert}
                />,
                <AlignTextExtension
                  key="align-right-extension"
                  type="right"
                  title={t('alignRight')}
                  onInsert={onInsert}
                />,
                <ImageUploadExtension
                  {...commonMediaProps}
                  key="image-upload-extension"
                  fileSizeExceeded={MAX_FILE_SIZE_25MB}
                />,
                <AudioUploadExtension
                  {...commonMediaProps}
                  key="audio-upload-extension"
                  fileSizeExceeded={MAX_FILE_SIZE_150MB}
                />,
                <VideoUploadExtension
                  {...commonMediaProps}
                  key="video-upload-extension"
                  fileSizeExceeded={MAX_FILE_SIZE_150MB}
                />,
                <UnderlineExtension key="underline-extension" onInsert={onInsert} />,
                <StrikethroughExtension key="strikethrough-extension" onInsert={onInsert} />,
                <SubscriptExtension key="subscript-extension" onInsert={onInsert} />,
                <SuperscriptExtension key="superscript-extension" onInsert={onInsert} />,
              ]}
              toolbars={[
                'bold',
                'italic',
                'title',
                '-',
                8, // UnderlineExtension
                9, // StrikethroughExtension
                0, // MarkExtension
                10, // SubscriptExtension
                11, // SuperscriptExtension
                2, // AlignTextExtension: left
                3, // AlignTextExtension: center
                4, // AlignTextExtension: right
                '-',
                'quote',
                'orderedList',
                'unorderedList',
                'link',
                'codeRow',
                'table',
                '-',
                'revoke',
                'next',
                1, // TrashExtension
                5, // ImageUploadExtension
                6, // AudioUploadExtension
                7, // VideoUploadExtension
                '-',
                'catalog',
                'preview',
                'pageFullscreen',
                'htmlPreview',
              ]}
              footers={[0, '=', 1]}
              defFooters={[
                <FooterMessage inputSize={(value ?? '').length} key="footer-message" />,
                <CharacterCounter inputSize={(value ?? '').length} key="character-counter" />,
              ]}
            />
            {isLoading && <Spinner uiType={SpinnerUiType.Secondary} />}
            {error?.message && <StyledErrorText>{error.message}</StyledErrorText>}
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
