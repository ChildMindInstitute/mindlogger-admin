import { useCallback, useRef } from 'react';
import { FieldValues, Controller, useFormContext } from 'react-hook-form';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt';

import { MediaType, UploadFileError } from 'shared/consts';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

import { EditorControllerProps, EditorUiType } from './EditorController.types';
import { Editor } from './Editor';

export const EditorController = <T extends FieldValues>({
  name,
  control,
  uiType = EditorUiType.Primary,
  editorId,
  disabled = false,
  withDebounce = false,
  placeholder,
  'data-testid': dataTestid,
}: EditorControllerProps<T>) => {
  const dispatch = useAppDispatch();
  const editorRef = useRef<ExposeParam>();
  const { clearErrors, trigger } = useFormContext();

  const onFileSizeExceeded = useCallback(
    (size: number | null) => {
      if (size === null) return;

      dispatch(
        banners.actions.addBanner({
          key: 'FileSizeExceededBanner',
          bannerProps: { size },
        }),
      );
    },
    [dispatch],
  );

  const onIncorrectFileFormat = useCallback(
    (fileType: MediaType | null) => {
      if (fileType === null) return;

      dispatch(
        banners.actions.addBanner({
          key: 'IncorrectFileBanner',
          bannerProps: {
            errorType: UploadFileError.Format,
            fileType,
          },
        }),
      );
    },
    [dispatch],
  );

  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Editor
          editorId={editorId}
          editorRef={editorRef}
          value={value}
          onChange={(value) => {
            // Clear errors immediately when user starts typing
            if (error) {
              clearErrors(name);
            }
            // Call the original onChange
            onChange(value);
            // Trigger revalidation after debounce delay
            if (withDebounce) {
              setTimeout(() => {
                trigger(name);
              }, 600);
            }
          }}
          onInsert={onInsert}
          onFileExceeded={onFileSizeExceeded}
          onIncorrectFileFormat={onIncorrectFileFormat}
          uiType={uiType}
          error={error}
          disabled={disabled}
          withDebounce={withDebounce}
          placeholder={placeholder}
          data-testid={dataTestid}
        />
      )}
    />
  );
};
