import { useCallback, useRef } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt';
import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import {
  LANGUAGE_BY_DEFAULT,
  AlignTextExtension,
  AudioUploadExtension,
  CharacterCounter,
  ImageUploadExtension,
  FooterMessage,
  TrashExtension,
  VideoUploadExtension,
  MarkExtension,
  UnderlineExtension,
  StrikethroughExtension,
  SubscriptExtension,
  SuperscriptExtension,
} from 'shared/components';

import { StyledErrorText, StyledMdEditor } from './EditorController.styles';
import { EditorControllerProps } from './EditorController.types';

export const EditorController = <T extends FieldValues>({
  name,
  control,
}: EditorControllerProps<T>) => {
  const { t } = useTranslation('app');
  const editorRef = useRef<ExposeParam>();

  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <StyledMdEditor
            className={error ? 'has-error' : ''}
            ref={editorRef}
            modelValue={value ?? ''}
            onChange={onChange}
            language={LANGUAGE_BY_DEFAULT}
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
              <ImageUploadExtension key="image-upload-extension" onInsert={onInsert} />,
              <AudioUploadExtension key="audio-upload-extension" onInsert={onInsert} />,
              <VideoUploadExtension key="video-upload-extension" onInsert={onInsert} />,
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
  );
};
