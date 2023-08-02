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
import { IncorrectImagePopup } from 'shared/components/IncorrectImagePopup';
import { MAX_FILE_SIZE_150MB, MAX_FILE_SIZE_25MB, UploadImageError } from 'shared/consts';

import { StyledErrorText, StyledMdEditor } from './EditorController.styles';
import { EditorControllerProps, EditorUiType } from './EditorController.types';

export const EditorController = <T extends FieldValues>({
  name,
  control,
  uiType = EditorUiType.Primary,
  editorId,
}: EditorControllerProps<T>) => {
  const { t } = useTranslation('app');
  const editorRef = useRef<ExposeParam>();
  const [fileSizeExceeded, setFileSizeExceeded] = useState<number | null>(null);
  const [incorrectImageFormat, setIncorrectImageFormat] = useState(false);

  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <StyledMdEditor
              editorId={editorId}
              className={`${uiType} ${error ? 'has-error' : ''}`}
              ref={editorRef}
              modelValue={value ?? ''}
              onChange={onChange}
              language={LANGUAGE_BY_DEFAULT}
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
                  key="image-upload-extension"
                  onInsert={onInsert}
                  setFileSizeExceeded={setFileSizeExceeded}
                  fileSizeExceeded={MAX_FILE_SIZE_25MB}
                  setIncorrectImageFormat={setIncorrectImageFormat}
                />,
                <AudioUploadExtension
                  key="audio-upload-extension"
                  onInsert={onInsert}
                  setFileSizeExceeded={setFileSizeExceeded}
                  fileSizeExceeded={MAX_FILE_SIZE_150MB}
                />,
                <VideoUploadExtension
                  key="video-upload-extension"
                  onInsert={onInsert}
                  setFileSizeExceeded={setFileSizeExceeded}
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
            {error?.message && <StyledErrorText>{error.message}</StyledErrorText>}
          </>
        )}
      />
      {!!fileSizeExceeded && (
        <FileSizeExceededPopup
          popupVisible={!!fileSizeExceeded}
          size={fileSizeExceeded}
          onClose={() => setFileSizeExceeded(null)}
        />
      )}
      {incorrectImageFormat && (
        <IncorrectImagePopup
          popupVisible={incorrectImageFormat}
          onClose={() => setIncorrectImageFormat(false)}
          uiType={UploadImageError.Format}
        />
      )}
    </>
  );
};
