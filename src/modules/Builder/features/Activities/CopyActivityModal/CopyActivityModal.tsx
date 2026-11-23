import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Checkbox } from '@mui/material';

import { getWorkspaceAppletsApi } from 'api';
import { auth } from 'redux/modules';
import { Modal, Spinner, SpinnerUiType, Table, UiType } from 'shared/components';
import { SelectController } from 'shared/components/FormComponents';
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
import {
  CopyActivityForm,
  CopyActivityModalProps,
  CopyTargetApplet,
} from './CopyActivityModal.types';
import { getCopyTargetApplets, getCopyTargetWorkspaces } from './CopyActivityModal.utils';

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
  const { result: workspacesList = [] } = workspaces.useWorkspacesData() ?? {};
  const userId = auth.useData()?.user?.id;
  const workspaceOptions = getCopyTargetWorkspaces(workspacesList, userId);
  const { control, reset, getValues } = useForm<CopyActivityForm>({ defaultValues: { ownerId } });
  const selectedOwnerId = useWatch({ control, name: 'ownerId' });
  const [applets, setApplets] = useState<CopyTargetApplet[]>([]);
  const [selectedApplet, setSelectedApplet] = useState<CopyTargetApplet | null>(null);

  const { execute: getWorkspaceApplets, isLoading } = useAsync(
    getWorkspaceAppletsApi,
    (response, body) => {
      // Skip a late response for a workspace that is no longer chosen
      if (body?.params.ownerId !== getValues('ownerId')) return;

      setApplets(getCopyTargetApplets(response?.data?.result ?? [], appletId));
    },
  );

  useEffect(() => {
    // Start on the current workspace next time
    if (!isOpen) {
      reset({ ownerId });

      return;
    }
    if (!selectedOwnerId) return;

    setSelectedApplet(null);
    getWorkspaceApplets({ params: { ownerId: selectedOwnerId, limit: MAX_LIMIT, flatList: true } });
  }, [isOpen, ownerId, selectedOwnerId]);

  const rows = applets.map((applet, index) => {
    const isSelected = selectedApplet?.id === applet.id;
    // Only one applet can be picked
    const isDisabled = !!selectedApplet && !isSelected;

    return {
      // Adds the MuiTableRow-selected class for the highlight
      ...(isSelected && { rowState: { value: 'selected' } }),
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
          {workspaceOptions.length > 1 && (
            <SelectController
              control={control}
              name="ownerId"
              label={t('workspace')}
              options={workspaceOptions}
              isLabelNeedTranslation={false}
              sx={{ width: '34.4rem', mb: theme.spacing(2.4) }}
              data-testid={`${dataTestid}-workspace`}
            />
          )}
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
