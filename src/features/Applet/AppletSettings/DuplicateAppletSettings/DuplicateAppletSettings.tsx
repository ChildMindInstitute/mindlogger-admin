import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'components';
import { StyledHeadlineLarge } from 'styles/styledComponents/Typography';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
} from '../AppletSettings.styles';

export const DuplicateAppletSettings = () => {
  const { t } = useTranslation('app');
  const { id } = useParams();
  const dispatch = useAppDispatch();

  return (
    <>
      <StyledHeadlineLarge>{t('duplicateApplet')}</StyledHeadlineLarge>
      <StyledAppletSettingsDescription>{t('duplicateDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="duplicate" />}
        onClick={() =>
          dispatch(
            popups.actions.setPopupVisible({
              appletId: id || '',
              key: 'duplicatePopupsVisible',
              value: true,
            }),
          )
        }
      >
        {t('duplicate')}
      </StyledAppletSettingsButton>
    </>
  );
};
