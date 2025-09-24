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

  // Use form context safely - may not be available in tests
  let clearErrors: ((name?: string) => void) | undefined;
  let trigger: ((name?: string) => Promise<boolean>) | undefined;

  try {
    const formContext = useFormContext();
    clearErrors = formContext?.clearErrors;
    trigger = formContext?.trigger;
  } catch (error) {
    // Form context not available - fallback for tests
    clearErrors = undefined;
    trigger = undefined;
  }

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
            if (error && clearErrors) {
              clearErrors(name);
            }
            // Call the original onChange
            onChange(value);
            // Trigger revalidation after debounce delay
            if (withDebounce && trigger) {
              setTimeout(() => {
                trigger!(name);
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
