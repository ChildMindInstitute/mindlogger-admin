import { Controller, FieldValues } from 'react-hook-form';

import { StyledEditor } from './EditorController.styles';
import { EditorControllerProps } from './EditorController.types';

export const EditorController = <T extends FieldValues>({
  name,
  control,
  preview = 'edit',
  customChange,
}: EditorControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <StyledEditor
        onChange={(editorValue, event) => {
          customChange && customChange(editorValue, event);
          onChange(event);
        }}
        value={value}
        preview={preview}
        visibleDragbar={false}
      />
    )}
  />
);
