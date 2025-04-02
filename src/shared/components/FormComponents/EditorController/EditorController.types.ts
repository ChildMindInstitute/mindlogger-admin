import { ChangeEvent } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export enum EditorUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type EditorProps = {
  customChange?: (value?: string, event?: ChangeEvent<HTMLTextAreaElement>) => void;
  preview?: 'live' | 'edit' | 'preview';
  uiType?: EditorUiType;
  editorId?: string;
  disabled?: boolean;
  withDebounce?: boolean;
  placeholder?: string;
  'data-testid'?: string;
};

export type EditorControllerProps<T extends FieldValues> = EditorProps & UseControllerProps<T>;
