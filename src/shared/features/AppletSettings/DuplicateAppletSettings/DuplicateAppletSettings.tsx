import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { popups } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { Svg } from 'shared/components';

import {
  StyledAppletSettingsButton,
  StyledAppletSettingsDescription,
  StyledHeadline,
} from '../AppletSettings.styles';

export const DuplicateAppletSettings = () => {
  const { t } = useTranslation('app');
  const { appletId: id } = useParams();
  const dispatch = useAppDispatch();

  return (
    <>
      <StyledHeadline>{t('duplicateApplet')}</StyledHeadline>
      <StyledAppletSettingsDescription>{t('duplicateDescription')}</StyledAppletSettingsDescription>
      <StyledAppletSettingsButton
        variant="outlined"
        startIcon={<Svg width="18" height="18" id="duplicate" />}
        onClick={() =>
          dispatch(
            popups.actions.setPopupVisible({
              appletId: id || '',
              encryption: undefined,
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
