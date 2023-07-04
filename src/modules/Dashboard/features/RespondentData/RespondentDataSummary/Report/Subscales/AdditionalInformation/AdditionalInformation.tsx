import { useTranslation } from 'react-i18next';
import 'md-editor-rt/lib/style.css';

import { StyledHeadline, theme } from 'shared/styles';
import { AdditionalInformation as AdditionalInformationProps } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';

import { StyledHeader, StyledContent, StyledMdEditor } from './AdditionalInformation.styles';

export const AdditionalInformation = ({ description }: AdditionalInformationProps) => {
  const { t } = useTranslation();

  return (
    !!description && (
      <>
        <StyledHeader>
          <StyledHeadline sx={{ mr: theme.spacing(1.6) }}>
            {t('additionalInformation')}
          </StyledHeadline>
        </StyledHeader>
        <StyledContent>
          <StyledMdEditor modelValue={description} previewOnly />
        </StyledContent>
      </>
    )
  );
};
