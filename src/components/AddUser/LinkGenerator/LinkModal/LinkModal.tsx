import { useState } from 'react';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BasicPopUp } from 'components/Popups/BasicPopUp';
import { postAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';
import { StyledHeadline } from 'styles/styledComponents/Typography';

import {
  StyledButton,
  StyledModalBtn,
  StyledModalWrapper,
  StyledModalText,
} from './LinkModal.styles';
import { LinkGeneratorProps } from '../LinkGenerator.types';

export const LinkModal = ({ setInviteLink }: Pick<LinkGeneratorProps, 'setInviteLink'>) => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const [modalShowed, setModalShowed] = useState(false);

  const handleModalClose = () => setModalShowed(false);

  const handleModalOpen = () => setModalShowed(true);

  const postAppletLink = async (requireLogin: boolean) => {
    try {
      if (id) {
        const { data } = await postAppletPublicLinkApi({
          appletId: id,
          requireLogin,
        });
        data && setInviteLink(data);
        handleModalClose();
      }
    } catch (e) {
      getErrorMessage(e);
    }
  };

  return (
    <>
      <StyledButton onClick={handleModalOpen}>{t('generateLink')}</StyledButton>
      <BasicPopUp open={modalShowed} handleClose={handleModalClose}>
        <StyledModalWrapper>
          <StyledHeadline>{t('publicLink')}</StyledHeadline>
          <StyledModalText>{t('requireToCreateAccount')}</StyledModalText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledModalBtn onClick={() => postAppletLink(true)}>{t('yes')}</StyledModalBtn>
            <StyledModalBtn onClick={() => postAppletLink(false)}>{t('no')}</StyledModalBtn>
            <StyledModalBtn onClick={handleModalClose}>{t('cancel')}</StyledModalBtn>
          </Box>
        </StyledModalWrapper>
      </BasicPopUp>
    </>
  );
};
