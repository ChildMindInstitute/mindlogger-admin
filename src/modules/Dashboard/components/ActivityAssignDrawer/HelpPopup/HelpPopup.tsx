import { Trans, useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { StyledBorderedOverflow } from 'shared/styles';

import { HelpPopupProps } from './HelpPopup.types';
import { StyledHelpParagraph, StyledHelpTitle } from './HelpPopup.styles';

export const HelpPopup = ({ isVisible, setIsVisible, ...rest }: HelpPopupProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });

  return (
    <Modal
      open={isVisible}
      onClose={() => setIsVisible(false)}
      width="56"
      title={t('helpTitle')}
      hasActions
      buttonText={t('helpButton')}
      submitBtnVariant="outlined"
      onSubmit={() => setIsVisible(false)}
      {...rest}
    >
      <StyledBorderedOverflow sx={{ maxHeight: '43.6rem' }}>
        <Box sx={{ px: 3.2, pb: 2.4 }}>
          <Trans i18nKey="activityAssign.helpContent">
            <StyledHelpTitle></StyledHelpTitle>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpTitle></StyledHelpTitle>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpTitle></StyledHelpTitle>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpParagraph></StyledHelpParagraph>
            <StyledHelpTitle></StyledHelpTitle>
            <StyledHelpParagraph></StyledHelpParagraph>
          </Trans>
        </Box>
      </StyledBorderedOverflow>
    </Modal>
  );
};
