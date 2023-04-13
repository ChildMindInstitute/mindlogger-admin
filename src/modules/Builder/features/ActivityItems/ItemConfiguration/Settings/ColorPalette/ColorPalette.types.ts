import { Dispatch, SetStateAction } from 'react';

export type ColorPaletteProps = {
  name: string;
  setShowColorPalette: Dispatch<SetStateAction<boolean>>;
};
