import { ChangeEvent } from 'react';
import { FieldValues, UseControllerProps } from 'react-hook-form';

export type EditorProps = {
  name: string;
  customChange?: (value?: string, event?: ChangeEvent<HTMLTextAreaElement>) => void;
  preview?: 'live' | 'edit' | 'preview';
};

export type EditorControllerProps<T extends FieldValues> = EditorProps & UseControllerProps<T>;
