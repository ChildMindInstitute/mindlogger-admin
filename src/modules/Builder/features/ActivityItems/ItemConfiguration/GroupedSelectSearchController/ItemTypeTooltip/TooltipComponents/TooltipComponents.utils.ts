export const getSelectionSvgId = (index: number, isSingleSelection: boolean) => {
  if (isSingleSelection) {
    return index === 1 ? 'radio-button-outline' : 'radio-button-empty-outline';
  }

  return index === 2 ? 'checkbox-empty-outline' : 'checkbox-filled';
};

export const getSelectionPerRowSvgId = (rowIndex: number, colIndex: number, isSingleSelection: boolean) => {
  if (isSingleSelection) {
    return (rowIndex === 1 && colIndex === 1) ||
      (rowIndex === 2 && colIndex === 2) ||
      (rowIndex === 3 && colIndex === 3)
      ? 'radio-button-outline'
      : 'radio-button-empty-outline';
  }

  return rowIndex === 1 || (rowIndex === 2 && (colIndex === 1 || colIndex === 2)) || (rowIndex === 3 && colIndex === 1)
    ? 'checkbox-filled'
    : 'checkbox-empty-outline';
};
