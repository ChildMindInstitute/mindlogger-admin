import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { variables } from 'shared/styles';
import { StyledLabelBoldMedium, StyledLabelMedium } from 'shared/styles/styledComponents';

import {
  StyledCollapse,
  StyledContainer,
  StyledContent,
  StyledButton,
} from './AssessmentBanner.styles';
import { AssessmentBannerProps } from './AssessmentBanner.types';

export const AssessmentBanner = ({
  isBannerVisible,
  onSelectLastVersion,
}: AssessmentBannerProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledCollapse in={isBannerVisible} data-testid="assessment-banner">
      <StyledContainer>
        <StyledContent>
          <Svg id="exclamation-circle" width="22" height="22" />
          <StyledLabelBoldMedium sx={{ gridArea: 'header' }}>
            {t('assessmentBanner.header')}
          </StyledLabelBoldMedium>
          <StyledLabelMedium sx={{ gridArea: 'text' }}>
            {t('assessmentBanner.text')}
          </StyledLabelMedium>
          <StyledButton onClick={onSelectLastVersion} data-testid="assessment-banner-button">
            <StyledLabelBoldMedium sx={{ color: variables.palette.primary }}>
              {t('assessmentBanner.button')}
            </StyledLabelBoldMedium>
          </StyledButton>
        </StyledContent>
      </StyledContainer>
    </StyledCollapse>
  );
};
