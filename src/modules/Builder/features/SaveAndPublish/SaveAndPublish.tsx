import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { builderSessionStorage, getBuilderAppletUrl } from 'shared/utils';
import { Svg } from 'shared/components';
import { applet } from 'shared/state';
import { useAppDispatch } from 'redux/store';
import { updateApplet } from 'shared/state/Applet/Applet.thunk';
import { BuilderLayers, useCheckIfNewApplet } from 'shared/hooks';

import { StyledButton } from './SaveAndPublish.styles';
import { useAppletData } from './SaveAndPublish.hooks';

const clearStorage = () => {
  builderSessionStorage.setItem(BuilderLayers.Applet, {});
  builderSessionStorage.setItem(BuilderLayers.Activity, {});
  builderSessionStorage.setItem(BuilderLayers.AppletHasDiffs, false);
};

export const SaveAndPublish = () => {
  const { t } = useTranslation('app');
  const getAppletData = useAppletData();
  const { createApplet } = applet.thunk;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { appletId } = useParams();
  const isNewApplet = useCheckIfNewApplet();

  const handleClick = async () => {
    const body = getAppletData();

    let result;
    if (isNewApplet || !appletId) {
      result = await dispatch(createApplet(body));
    }
    if (!isNewApplet && appletId) {
      result = await dispatch(updateApplet({ appletId, body }));
    }
    if (!result) return;

    clearStorage();
    if (!isNewApplet) return;

    if (createApplet.fulfilled.match(result)) {
      const createdAppletId = result.payload.data.result?.id;
      createdAppletId && navigate(getBuilderAppletUrl(createdAppletId));
    }
  };

  return (
    <StyledButton
      variant="contained"
      startIcon={<Svg id="save" width={18} height={18} />}
      onClick={handleClick}
    >
      {t('saveAndPublish')}
    </StyledButton>
  );
};
