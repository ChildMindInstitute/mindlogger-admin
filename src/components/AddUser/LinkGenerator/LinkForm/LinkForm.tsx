import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

import { deleteAppletPublicLinkApi } from 'api';
import { getErrorMessage } from 'utils/getErrorMessage';

import { StyledButton } from './LinkForm.styles';
import { LinkGeneratorProps } from '../LinkGenerator.types';

export const LinkForm = ({ inviteLink, setInviteLink }: LinkGeneratorProps) => {
  const { id } = useParams();

  const deleteAppletPublicLink = async () => {
    try {
      if (id) {
        await deleteAppletPublicLinkApi({ appletId: id });
        setInviteLink(null);
      }
    } catch (e) {
      getErrorMessage(e);
    }
  };

  return (
    <>
      {inviteLink?.requireLogin ? (
        <div>Share the following link to invite anyone to this study.</div>
      ) : (
        <div>Share the following link for users to take assessment without account.</div>
      )}
      <TextField
        label=""
        defaultValue={inviteLink?.inviteId || ''}
        InputProps={{
          readOnly: true,
        }}
      />
      <Box sx={{ display: 'flex' }}>
        <StyledButton variant="outlined" onClick={deleteAppletPublicLink}>
          Delete invite link
        </StyledButton>
        <div>Delete this link no longer allow anyone to access url</div>
      </Box>
    </>
  );
};
