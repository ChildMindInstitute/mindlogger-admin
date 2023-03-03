import { useTranslation } from 'react-i18next';

import { Svg } from 'components';
import theme from 'styles/theme';
import { StyledBodyMedium } from 'styles/styledComponents';

import {
  StyledPresentation,
  StyledPresentationLine,
  StyledTooltipText,
} from '../TooltipComponents.styles';
import { SelectionProps, SelectionUiType } from '../TooltipComponents.types';

export const Selection = ({ uiType }: SelectionProps) => {
  const { t } = useTranslation();
  const isSingleSelection = uiType === SelectionUiType.Single;

  const optionOne = (
    <StyledTooltipText sx={{ ml: theme.spacing(1) }}>{t('option')} 1</StyledTooltipText>
  );

  const optionTwo = (
    <StyledTooltipText sx={{ ml: theme.spacing(1) }}>{t('option')} 2</StyledTooltipText>
  );

  const optionThree = (
    <StyledTooltipText sx={{ ml: theme.spacing(1) }}>{t('option')} 3</StyledTooltipText>
  );

  const commonProps = {
    width: '20',
    height: '20',
  };

  return (
    <>
      <StyledPresentation>
        <StyledPresentationLine>
          <Svg
            id={isSingleSelection ? 'radio-button-empty-outline' : 'checkbox-filled'}
            {...commonProps}
          />
          {optionOne}
        </StyledPresentationLine>
        <StyledPresentationLine>
          <Svg
            id={isSingleSelection ? 'radio-button-outline' : 'checkbox-filled'}
            {...commonProps}
          />
          {optionTwo}
        </StyledPresentationLine>
        <StyledPresentationLine>
          <Svg
            id={isSingleSelection ? 'radio-button-empty-outline' : 'checkbox-empty-outline'}
            {...commonProps}
          />
          {optionThree}
        </StyledPresentationLine>
      </StyledPresentation>
      <StyledBodyMedium>
        {isSingleSelection
          ? t('provideListChoicesSingleAnswer')
          : t('provideListChoicesMultipleAnswers')}
      </StyledBodyMedium>
    </>
  );
};
