import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { ControllerRenderProps, FieldError } from 'react-hook-form';
import { ChangeEvent, ExposeParam, InsertContentGenerator } from 'md-editor-rt';

import { MediaType } from 'shared/consts';
import { InsertContentExtensionProps } from 'shared/components/MarkDownEditor/extensions/Extensions.types';

import { EditorUiType } from '../EditorController.types';

export type EditorProps = {
  editorId?: string;
  editorRef?: MutableRefObject<ExposeParam | undefined>;
  value?: string;
  onChange: ChangeEvent;
  onInsert: (generator: InsertContentGenerator) => void;
  onFileExceeded: Dispatch<SetStateAction<number | null>>;
  onIncorrectFileFormat: Dispatch<SetStateAction<MediaType | null>>;
  uiType: EditorUiType;
  error?: FieldError;
  disabled?: boolean;
  withDebounce?: boolean;
  'data-testid'?: string;
};

export type GetDefToolbars = {
  onInsert: InsertContentExtensionProps['onInsert'];
  onChange: ControllerRenderProps['onChange'];
  setFileSizeExceeded: Dispatch<SetStateAction<number | null>>;
  setIncorrectFormat: Dispatch<SetStateAction<MediaType | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
