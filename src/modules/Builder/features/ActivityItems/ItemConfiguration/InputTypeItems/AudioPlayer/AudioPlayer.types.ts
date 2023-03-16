import { FieldValues, Path, UseControllerProps } from 'react-hook-form';

export type AudioPlayerProps<T extends FieldValues> = {
  fileResource: Path<T>;
} & UseControllerProps<T>;
