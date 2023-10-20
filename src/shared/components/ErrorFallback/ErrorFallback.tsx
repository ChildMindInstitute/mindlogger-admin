import { FallbackProps } from 'react-error-boundary';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';

import { StyledLabelMedium, StyledLinkBtn, StyledTitleLarge } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { useTranslation } from 'react-i18next';

export const ErrorFallback = ({ error }: FallbackProps) => {
  const { t } = useTranslation('app');

  const onClick = () => {
    window.location.reload();
  };

  return (
    <Box>
      <StyledTitleLarge>{t('errorFallback.somethingWentWrong')}</StyledTitleLarge>
      <Accordion>
        <AccordionSummary
          expandIcon={<Svg id="navigate-down" />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <StyledTitleLarge>{t('errorFallback.details')}</StyledTitleLarge>
        </AccordionSummary>
        <AccordionDetails sx={{ whiteSpace: 'pre-wrap' }}>
          <StyledLabelMedium>{error.message}</StyledLabelMedium>
        </AccordionDetails>
      </Accordion>
      <StyledLinkBtn onClick={onClick}>{t('errorFallback.refreshPage')}</StyledLinkBtn>
    </Box>
  );
};
