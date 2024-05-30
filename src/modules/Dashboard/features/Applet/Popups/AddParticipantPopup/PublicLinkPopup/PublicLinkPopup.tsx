import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { deleteAppletPublicLinkApi, postAppletPublicLinkApi } from 'api';
import { Modal, Spinner } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { StyledBodyLarge, StyledFlexAllCenter, StyledModalWrapper } from 'shared/styles';

import { PublicLinkPopupProps } from './PublicLinkPopup.types';

export const PublicLinkPopup = ({
  appletId,
  'data-testid': dataTestId,
  hasPublicLink = false,
  onClose,
  ...otherProps
}: PublicLinkPopupProps) => {
  const { t } = useTranslation('app');
  const {
    execute: createPublicLink,
    isLoading: createIsLoading,
    error: createError,
  } = useAsync(postAppletPublicLinkApi, (res) => {
    if (res?.data?.result) {
      onClose?.(true);
    }
  });
  const {
    execute: deletePublicLink,
    isLoading: deleteIsLoading,
    error: deleteError,
  } = useAsync(deleteAppletPublicLinkApi, (res) => {
    if (res?.status === 204) {
      onClose?.();
    }
  });
  const isLoading = createIsLoading || deleteIsLoading;
  const hasError = (createError || deleteError) && !isLoading;

  const handleCreatePublicLink = (requireLogin: boolean = false) => {
    if (appletId) {
      createPublicLink({ appletId, requireLogin });
    }
  };

  const handleDeletePublicLink = () => {
    if (appletId) {
      deletePublicLink({ appletId });
    }
  };

  return (
    <Modal
      data-testid={dataTestId}
      footer={
        <StyledFlexAllCenter sx={{ gap: 1.6, width: '100%' }}>
          {hasPublicLink ? (
            <Button
              color="error"
              data-testId={dataTestId && `${dataTestId}-delete-btn`}
              onClick={handleDeletePublicLink}
              variant="contained"
            >
              {t('delete')}
            </Button>
          ) : (
            <>
              <Button
                data-testId={dataTestId && `${dataTestId}-no-account-btn`}
                disabled={isLoading}
                onClick={() => {
                  handleCreatePublicLink(false);
                }}
                variant="outlined"
              >
                {t('publicLinkCreateAccountNotRequired')}
              </Button>

              <Button
                data-testId={dataTestId && `${dataTestId}-account-btn`}
                disabled={isLoading}
                onClick={() => {
                  handleCreatePublicLink(true);
                }}
                variant="outlined"
              >
                {t('publicLinkCreateAccountRequired')}
              </Button>
            </>
          )}
        </StyledFlexAllCenter>
      }
      hasActions={false}
      onClose={() => onClose?.()}
      title={hasPublicLink ? t('deletePublicLink') : t('publicLinkCreate')}
      {...otherProps}
    >
      <StyledModalWrapper sx={{ flexDirection: 'column', gap: 1.6 }}>
        <StyledBodyLarge>
          {hasPublicLink ? t('publicLinkDeleteDescription') : t('publicLinkCreateDescription')}
        </StyledBodyLarge>

        {hasError && (
          <StyledBodyLarge color="error">
            {createError ? t('publicLinkCreateError') : t('publicLinkDeleteError')}
          </StyledBodyLarge>
        )}

        {isLoading && <Spinner />}
      </StyledModalWrapper>
    </Modal>
  );
};
