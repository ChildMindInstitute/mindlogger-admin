import { useState } from 'react';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';

import { Basic } from 'components/Popups/Basic';
import { StyledTitle } from 'components/AddUser/AddUser.styles';

import { postAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';

import {
  StyledButton,
  StyledModalBtn,
  StyledModalWrapper,
  StyledModalText,
} from './LinkModal.styles';
import { LinkGeneratorProps } from '../LinkGenerator.types';

export const LinkModal = ({ setInviteLink }: Pick<LinkGeneratorProps, 'setInviteLink'>) => {
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
      <StyledButton onClick={handleModalOpen}>Generate Link</StyledButton>
      <Basic open={modalShowed} handleClose={handleModalClose}>
        <StyledModalWrapper>
          <StyledTitle>Public Link</StyledTitle>
          <StyledModalText>Do you want to require user to create account?</StyledModalText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledModalBtn onClick={() => postAppletLink(true)}>YES</StyledModalBtn>
            <StyledModalBtn onClick={() => postAppletLink(false)}>NO</StyledModalBtn>
            <StyledModalBtn onClick={handleModalClose}>CANCEL</StyledModalBtn>
          </Box>
        </StyledModalWrapper>
      </Basic>
    </>
  );
};
