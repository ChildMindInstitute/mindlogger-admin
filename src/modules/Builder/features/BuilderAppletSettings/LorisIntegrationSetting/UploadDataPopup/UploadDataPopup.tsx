import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Error, Modal, Spinner, SpinnerUiType } from 'shared/components';
import { StyledModalWrapper, StyledTitleMedium, theme, variables } from 'shared/styles';
import { useAsync } from 'shared/hooks/useAsync';
import { setLorisIntegrationApi } from 'modules/Builder/api';

import { getScreens } from './UploadDataPopup.const';
import { Steps, UploadDataPopupProps } from './UploadDataPopup.types';

export const UploadDataPopup = ({
  open,
  onClose,
  'data-testid': dataTestid,
}: UploadDataPopupProps) => {
  const { t } = useTranslation();
  const { appletId } = useParams();
  const [step, setStep] = useState<Steps>(Steps.Agreement);
  const { execute, error, isLoading } = useAsync(setLorisIntegrationApi);

  const onSubmit = async () => {
    if (!appletId) return;
    await execute({ appletId });
    setStep(Steps.Success);
  };

  const screens = getScreens({ onSubmit, onClose });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('loris.uploadPublicData')}
      onSubmit={screens[step].onSubmit}
      buttonText={t(screens[step].buttonText)}
      disabledSubmit={isLoading}
      data-testid={dataTestid}
    >
      <>
        {isLoading && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <StyledTitleMedium color={variables.palette.on_surface}>
            {screens[step].text}
          </StyledTitleMedium>
          {error && <Error sxProps={{ m: theme.spacing(1.5, 0, 1) }} error={error} />}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
