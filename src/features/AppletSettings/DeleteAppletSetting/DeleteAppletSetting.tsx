import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { DeletePopup } from 'components/Popups';
import { Svg } from 'components/Svg';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';
import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from 'styles/styledComponents/AppletSettings';

export const DeleteAppletSetting = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const dispatch = useAppDispatch();

  return (
    <>
      <StyledHeadlineLarge>{t('deleteApplet')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('deleteDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        color="error"
        onClick={() =>
          dispatch(
            popups.actions.setPopupVisible({
              appletId: id || '',
              key: 'deletePopupVisible',
              value: true,
            }),
          )
        }
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="trash" />}
      >
        {t('deleteApplet')}
      </StyledAppletSettingsButton>
      <DeletePopup />
    </>
  );
};
