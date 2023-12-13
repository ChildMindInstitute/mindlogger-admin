import { useCallback, useRef, useState } from 'react';
import { FieldValues, Controller } from 'react-hook-form';
import { ExposeParam, InsertContentGenerator } from 'md-editor-rt';

import { FileSizeExceededPopup } from 'shared/components/MarkDownEditor/FileSizeExceededPopup';
import { IncorrectFilePopup } from 'shared/components/IncorrectFilePopup';
import { MediaType, UploadFileError } from 'shared/consts';
import { concatIf } from 'shared/utils/concatIf';

import { EditorControllerProps, EditorUiType } from './EditorController.types';
import { Editor } from './Editor';

export const EditorController = <T extends FieldValues>({
  name,
  control,
  uiType = EditorUiType.Primary,
  editorId,
  disabled = false,
  withDebounce = false,
  'data-testid': dataTestid,
}: EditorControllerProps<T>) => {
  const editorRef = useRef<ExposeParam>();
  const [fileSizeExceeded, setFileSizeExceeded] = useState<number | null>(null);
  const [incorrectFileFormat, setIncorrectFileFormat] = useState<MediaType | null>(null);

  const onInsert = useCallback((generator: InsertContentGenerator) => {
    editorRef.current?.insert(generator);
  }, []);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Editor
            editorId={editorId}
            editorRef={editorRef}
            value={value}
            onChange={onChange}
            onInsert={onInsert}
            onFileExceeded={setFileSizeExceeded}
            onIncorrectFileFormat={setIncorrectFileFormat}
            uiType={uiType}
            error={error}
            disabled={disabled}
            withDebounce={withDebounce}
            data-testid={dataTestid}
          />
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
