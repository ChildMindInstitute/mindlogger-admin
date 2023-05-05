import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import { StyledFlexTopCenter, StyledHeadline, theme } from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';
import { AdditionalInformation as AdditionalInformationProps } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';

import { StyledHeader, StyledContent, StyledMdEditor } from './AdditionalInformation.styles';

export const AdditionalInformation = ({ tooltip, description }: AdditionalInformationProps) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledHeader>
        <StyledHeadline sx={{ mr: theme.spacing(1.6) }}>
          {t('additionalInformation')}
        </StyledHeadline>
        {tooltip && (
          <Tooltip tooltipTitle={tooltip}>
            <StyledFlexTopCenter>
              <Svg id="more-info-outlined" />
            </StyledFlexTopCenter>
          </Tooltip>
        )}
      </StyledHeader>
      <StyledContent>
        <StyledMdEditor modelValue={description} previewOnly />
      </StyledContent>
    </>
  );
};
