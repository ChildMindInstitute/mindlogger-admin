import { Trans, useTranslation } from 'react-i18next';

import { Modal } from 'shared/components';
import { StyledModalWrapper } from 'shared/styles';
import { useAppDispatch } from 'redux/store';
import { library } from 'modules/Library/state';
import { STORAGE_LIBRARY_KEY, STORAGE_SELECTED_KEY } from 'modules/Library/consts';
import { getFilteredSelectedItems, getSelectedItemsFromStorage } from 'modules/Library/utils';

import { RemoveAppletPopupProps } from './RemoveAppletPopup.types';

export const RemoveAppletPopup = ({
  removeAppletPopupVisible,
  setRemoveAppletPopupVisible,
  appletId,
  appletName,
  isAuthorized,
  cartItems,
  'data-testid': dataTestid,
}: RemoveAppletPopupProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();

  const handleModalClose = () => setRemoveAppletPopupVisible(false);

  const handleSubmit = () => {
    const updatedAppletsData = cartItems?.filter((applet) => applet.id !== appletId) || [];
    const selectedItemsFromStorage = getSelectedItemsFromStorage();
    const filteredSelectedItems = getFilteredSelectedItems(selectedItemsFromStorage, appletId);
    Object.keys(filteredSelectedItems)?.length > 0
      ? sessionStorage.setItem(STORAGE_SELECTED_KEY, JSON.stringify(filteredSelectedItems))
      : sessionStorage.removeItem(STORAGE_SELECTED_KEY);

    if (isAuthorized) {
      dispatch(library.thunk.postAppletsToCart(updatedAppletsData));
    } else {
      sessionStorage.setItem(STORAGE_LIBRARY_KEY, JSON.stringify(updatedAppletsData));
      dispatch(library.actions.setAppletsFromStorage(updatedAppletsData));
    }
    handleModalClose();
  };

  return (
    <Modal
      open={removeAppletPopupVisible}
      onClose={handleModalClose}
      onSubmit={handleSubmit}
      title={t('removeApplet')}
      buttonText={t('yesRemove')}
      submitBtnColor="error"
      hasSecondBtn
      secondBtnText={t('back')}
      onSecondBtnSubmit={handleModalClose}
      data-testid={dataTestid}
    >
      <StyledModalWrapper>
        <Trans i18nKey="removeAppletConfirmation">
          Are you sure you want to to remove Applet
          <strong>
            <>{{ appletName }}</>
          </strong>
          from your cart?
        </Trans>
      </StyledModalWrapper>
    </Modal>
  );
};
