import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { BasicPopUp } from 'components/Popups/BasicPopUp';
import { StyledHeadline } from 'styles/styledComponents/Typography';
import { StyledModalBtn, StyledModalText, StyledModalWrapper } from 'styles/styledComponents/Modal';
import { useAsync } from 'hooks/useAsync';
import { account } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { deleteAppletApi } from 'api';

import { DeletePopUpProps } from './DeletePopUp.types';

export const DeletePopUp = ({
  deleteModalVisible,
  setDeleteModalVisible,
  item,
}: DeletePopUpProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const accountData = account.useData();
  const { execute, error } = useAsync(() => deleteAppletApi({ appletId: item.id || '' }));

  const deleteModalClose = () => setDeleteModalVisible(false);

  const handleDeleteApplet = async () => {
    await execute();

    !error &&
      dispatch(account.thunk.switchAccount({ accountId: accountData?.account.accountId || '' }));
    deleteModalClose();
  };

  return (
    <BasicPopUp open={deleteModalVisible} handleClose={deleteModalClose}>
      <StyledModalWrapper>
        <StyledHeadline>{t('deleteApplet')}</StyledHeadline>
        <StyledModalText>{t('confirmDeleteApplet')}</StyledModalText>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <StyledModalBtn variant="text" onClick={handleDeleteApplet}>
            {t('yes')}
          </StyledModalBtn>
          <StyledModalBtn variant="text" onClick={deleteModalClose}>
            {t('no')}
          </StyledModalBtn>
        </Box>
      </StyledModalWrapper>
    </BasicPopUp>
  );
};
