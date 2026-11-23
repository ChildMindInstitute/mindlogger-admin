import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Checkbox } from '@mui/material';

import { getWorkspaceAppletsApi } from 'api';
import { Modal, Spinner, SpinnerUiType, Table, UiType } from 'shared/components';
import { MAX_LIMIT } from 'shared/consts';
import { useAsync } from 'shared/hooks/useAsync';
import { workspaces } from 'shared/state';
import {
  StyledErrorText,
  StyledFlexTopCenter,
  StyledLabelLarge,
  StyledModalWrapper,
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  theme,
  variables,
} from 'shared/styles';

import { getHeadCells } from './CopyActivityModal.const';
import { StyledTableWrapper } from './CopyActivityModal.styles';
import { CopyActivityModalProps, CopyTargetApplet } from './CopyActivityModal.types';
import { getCopyTargetApplets } from './CopyActivityModal.utils';

export const CopyActivityModal = ({
  isOpen,
  activityName,
  isCopying,
  errorMessage,
  onClose,
  onSubmit,
  'data-testid': dataTestid,
}: CopyActivityModalProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const { ownerId } = workspaces.useData() ?? {};
  const [applets, setApplets] = useState<CopyTargetApplet[]>([]);
  const [selectedApplet, setSelectedApplet] = useState<CopyTargetApplet | null>(null);

  const { execute: getWorkspaceApplets, isLoading } = useAsync(getWorkspaceAppletsApi, (response) =>
    setApplets(getCopyTargetApplets(response?.data?.result ?? [], appletId)),
  );

  useEffect(() => {
    if (!isOpen || !ownerId) return;

    setSelectedApplet(null);
    getWorkspaceApplets({ params: { ownerId, limit: MAX_LIMIT, flatList: true } });
  }, [isOpen, ownerId]);

  const rows = applets.map((applet, index) => {
    const isSelected = selectedApplet?.id === applet.id;
    // Only one applet can be picked
    const isDisabled = !!selectedApplet && !isSelected;

    return {
      name: {
        content: () => (
          <StyledFlexTopCenter>
            {applet.image ? (
              <StyledSmallAppletImg src={applet.image} alt="Applet image" />
            ) : (
              <StyledSmallAppletImgPlaceholder />
            )}
            <StyledLabelLarge
              sx={{ color: isDisabled ? variables.palette.on_surface_alpha38 : undefined }}
            >
              {applet.appletName}
            </StyledLabelLarge>
          </StyledFlexTopCenter>
        ),
        value: applet.appletName,
      },
      actions: {
        content: () => (
          <Checkbox
            checked={isSelected}
            disabled={isDisabled}
            onChange={() => setSelectedApplet(isSelected ? null : applet)}
            data-testid={`${dataTestid}-checkbox-${index}`}
          />
        ),
        value: applet.id,
      },
    };
  });

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onSubmit={() => selectedApplet && onSubmit(selectedApplet)}
      title={t('copyActivityTitle', { activityName })}
      buttonText={t('copy')}
      disabledSubmit={!selectedApplet || isCopying}
      data-testid={dataTestid}
    >
      <>
        {(isLoading || isCopying) && <Spinner uiType={SpinnerUiType.Secondary} noBackground />}
        <StyledModalWrapper>
          <StyledTableWrapper>
            <Table
              columns={getHeadCells()}
              rows={rows}
              orderBy="name"
              maxHeight="46.4rem"
              uiType={UiType.Secondary}
              tableHeadBg={variables.modalBackground}
              emptyComponent={isLoading ? '' : t('copyActivityNoApplets')}
              data-testid={`${dataTestid}-table`}
            />
          </StyledTableWrapper>
          {errorMessage && (
            <StyledErrorText sx={{ mt: theme.spacing(1) }}>{errorMessage}</StyledErrorText>
          )}
        </StyledModalWrapper>
      </>
    </Modal>
  );
};
