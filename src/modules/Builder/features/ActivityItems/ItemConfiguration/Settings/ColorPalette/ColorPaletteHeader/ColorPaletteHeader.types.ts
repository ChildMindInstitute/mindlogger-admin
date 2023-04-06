import { Dispatch, SetStateAction } from 'react';

export type ColorPaletteHeaderProps = {
  isExpanded: boolean;
  onArrowClick: () => void;
  setShowColorPalette: Dispatch<SetStateAction<boolean>>;
};
