import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import 'md-editor-rt/lib/style.css';

import { getOptionTextApi } from 'api';
import { useAsync } from 'shared/hooks/useAsync';
import { StyledHeadline, StyledTitleBoldMedium, theme } from 'shared/styles';
import { AdditionalInformation as AdditionalInformationProps } from 'modules/Dashboard/features/RespondentData/RespondentDataSummary/Report/Subscales/Subscales.types';
import { useFeatureFlags } from 'shared/hooks';

import { LINK_PATTERN } from '../../Charts/Charts.const';
import { StyledHeader, StyledContent, StyledMdPreview } from './AdditionalInformation.styles';

export const AdditionalInformation = ({
  optionText,
  severity,
  'data-testid': dataTestid,
}: AdditionalInformationProps) => {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlags();
  const { execute: getOptionText } = useAsync(getOptionTextApi, (response) =>
    setAdditionalInformation(response?.data || ''),
  );

  const [additionalInformation, setAdditionalInformation] = useState('');

  useEffect(() => {
    if (!optionText.match(LINK_PATTERN)) {
      return setAdditionalInformation(optionText);
    }

    getOptionText(optionText);
  }, [optionText]);

  return (
    <Box data-testid={dataTestid}>
      <StyledHeader>
        <StyledHeadline sx={{ mr: theme.spacing(1.6) }}>
          {t('additionalInformation')}
        </StyledHeadline>
      </StyledHeader>
      <StyledContent>
        {featureFlags.enableCahmiSubscaleScoring && severity && (
          <StyledTitleBoldMedium
            sx={{ pl: theme.spacing(2) }}
            data-testid={`${dataTestid}-severity`}
          >
            {t('subscaleLookupTable.column.severity')}: {severity}
          </StyledTitleBoldMedium>
        )}
        <StyledMdPreview modelValue={additionalInformation} />
      </StyledContent>
    </Box>
  );
};
