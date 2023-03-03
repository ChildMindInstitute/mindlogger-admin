import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'components';
import { StyledBodyMedium } from 'styles/styledComponents';

import {
  StyledPresentation,
  StyledTooltipText,
  StyledMatrixLine,
  StyledMatrixLineElement,
} from '../TooltipComponents.styles';
import { SelectionProps, SelectionUiType } from '../TooltipComponents.types';

export const SelectionPerRow = ({ uiType }: SelectionProps) => {
  const { t } = useTranslation();
  const isSingleSelection = uiType === SelectionUiType.Single;

  const commonProps = {
    width: '17',
    height: '17',
  };

  const getSvgId = (rowIndex: number, colIndex: number) => {
    if (isSingleSelection) {
      if (
        (rowIndex === 1 && colIndex === 1) ||
        (rowIndex === 2 && colIndex === 2) ||
        (rowIndex === 3 && colIndex === 3)
      ) {
        return 'radio-button-outline';
      }

      return 'radio-button-empty-outline';
    } else {
      if (
        rowIndex === 1 ||
        (rowIndex === 2 && (colIndex === 1 || colIndex === 2)) ||
        (rowIndex === 3 && colIndex === 1)
      ) {
        return 'checkbox-filled';
      }

      return 'checkbox-empty-outline';
    }
  };

  const selectionContent = [
    ['', '1', '2', '3'],
    ['A', 1, 2, 3],
    ['B', 1, 2, 3],
    ['C', 1, 2, 3],
  ];

  return (
    <>
      <StyledPresentation>
        {selectionContent.map((row, rowIndex) => (
          <StyledMatrixLine key={uniqueId()}>
            {row.map((col, colIndex) => (
              <StyledMatrixLineElement key={uniqueId()}>
                {col !== '' && typeof col === 'string' && (
                  <StyledTooltipText>{col}</StyledTooltipText>
                )}
                {typeof col !== 'string' && (
                  <Svg id={getSvgId(rowIndex, colIndex)} {...commonProps} />
                )}
              </StyledMatrixLineElement>
            ))}
          </StyledMatrixLine>
        ))}
      </StyledPresentation>
      <StyledBodyMedium>
        {isSingleSelection ? t('setupMatrixRadio') : t('setupMatrixCheckboxes')}
      </StyledBodyMedium>
      <StyledBodyMedium>
        {isSingleSelection ? t('respondentSelectSingle') : t('respondentSelectMultiple')}
      </StyledBodyMedium>
    </>
  );
};
