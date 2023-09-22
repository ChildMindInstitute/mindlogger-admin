import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium } from 'shared/styles/styledComponents';
import { createArray } from 'shared/utils';

import { SelectionOption } from './SelectionOption';
import { getSelectionSvgId } from './TooltipComponents.utils';
import { StyledPresentation, StyledPresentationLine } from './TooltipComponents.styles';
import { SelectionProps, SelectionUiType } from './TooltipComponents.types';

const commonProps = {
  width: '20',
  height: '20',
};

export const Selection = ({ uiType }: SelectionProps) => {
  const { t } = useTranslation();
  const isSingleSelection = uiType === SelectionUiType.Single;

  return (
    <>
      <StyledPresentation>
        {createArray(3, (index) => (
          <StyledPresentationLine key={uniqueId()}>
            <Svg id={getSelectionSvgId(index, isSingleSelection)} {...commonProps} />
            <SelectionOption optionNumber={index + 1} />
          </StyledPresentationLine>
        ))}
      </StyledPresentation>
      <StyledBodyMedium>
        {isSingleSelection ? t('singleSelectionHint') : t('multipleSelectionHint')}.
      </StyledBodyMedium>
    </>
  );
};
