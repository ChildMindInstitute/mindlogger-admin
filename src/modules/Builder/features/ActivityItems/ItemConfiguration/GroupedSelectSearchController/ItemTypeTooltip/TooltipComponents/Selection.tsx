import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledBodyMedium } from 'shared/styles/styledComponents';

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
        {new Array(3).fill(null).map((_, index) => (
          <StyledPresentationLine>
            <Svg id={getSelectionSvgId(index, isSingleSelection)} {...commonProps} />
            <SelectionOption optionNumber={index + 1} />
          </StyledPresentationLine>
        ))}
      </StyledPresentation>
      <StyledBodyMedium>
        {isSingleSelection
          ? t('provideListChoicesSingleAnswer')
          : t('provideListChoicesMultipleAnswers')}
      </StyledBodyMedium>
    </>
  );
};
