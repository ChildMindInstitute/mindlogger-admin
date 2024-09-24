import { useTranslation } from 'react-i18next';
import { Box, Button, Drawer, IconButton } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledHeadline,
  StyledHeadlineMedium,
  StyledTitleLarge,
} from 'shared/styles';
import { FlowChip, Svg } from 'shared/components';
import { useAsync, useModalBanners } from 'shared/hooks';
import { deleteAppletAssignmentsApi, PostAssignmentsParams } from 'api';
import { ActivityFlowThumbnail, AssignmentCounts } from 'modules/Dashboard/components';
import { useAppDispatch } from 'redux/store';
import { banners } from 'redux/modules';

import {
  ActivityUnassignDrawerProps,
  ActivityUnassignFormValues,
} from './ActivityUnassignDrawer.types';
import { StyledFooter, StyledFooterWrapper, StyledHeader } from './ActivityUnassignDrawer.styles';
import { ConfirmationPopup } from './ConfirmationPopup';
import { ActivityUnassignBannerComponents } from './ActivityUnassignDrawer.const';
import { AssignmentsTable } from './AssignmentsTable';
import { getConfirmationBody } from './ActivityUnassignDrawer.utils';

const dataTestId = 'applet-activity-unassign';

export const ActivityUnassignDrawer = ({
  appletId,
  activityOrFlow,
  onClose,
  open = false,
  participantContext = 'respondent',
  ...rest
}: ActivityUnassignDrawerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityUnassign' });
  const dispatch = useAppDispatch();
  const isFlow = !!activityOrFlow && 'activities' in activityOrFlow;
  const assignments = useMemo(() => activityOrFlow?.assignments ?? [], [activityOrFlow]);
  const hasSingleAssignment = assignments.length === 1;
  const [step, setStep] = useState(1);
  const { addBanner, removeBanner, removeAllBanners, bannersComponent } = useModalBanners(
    ActivityUnassignBannerComponents,
  );

  const { execute: deleteAssignments, isLoading } = useAsync<PostAssignmentsParams, null>(
    deleteAppletAssignmentsApi,
    (_response, args) => {
      removeBanner('NetworkErrorBanner');

      dispatch(
        banners.actions.addBanner({
          key: 'SaveSuccessBanner',
          bannerProps: {
            children: t('successMessage', { count: args?.assignments.length }),
          },
        }),
      );
    },
    () => addBanner('NetworkErrorBanner'),
  );

  const defaultValues = {
    selectedAssignments: hasSingleAssignment ? [assignments[0]] : [],
  };

  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<ActivityUnassignFormValues>({
    resolver: yupResolver(
      yup
        .object({
          selectedAssignments: yup.array().min(1).required(),
        })
        .required(),
    ),
    defaultValues,
  });

  const selected = useWatch({ control, name: 'selectedAssignments' });

  const assignmentCounts = useMemo(() => {
    const counts = { selfReports: 0, multiInformant: 0 };
    for (const assignment of assignments) {
      if (assignment.respondentSubject.id === assignment.targetSubject.id) {
        counts.selfReports++;
      } else {
        counts.multiInformant++;
      }
    }

    return counts;
  }, [assignments]);

  const handleClose = () => {
    onClose();
  };

  const handleClickNext = useCallback(() => {
    removeAllBanners();

    switch (step) {
      case 1:
        handleSubmit(() => setStep(2))();
        break;

      case 2:
        handleSubmit(async ({ selectedAssignments }) => {
          if (!appletId) return;

          await deleteAssignments({
            appletId,
            assignments: selectedAssignments.map((a) => ({
              activityId: a.activityId,
              activityFlowId: a.activityFlowId,
              respondentSubjectId: a.respondentSubject.id,
              targetSubjectId: a.targetSubject.id,
            })),
          });

          onClose(true);
        })();
        break;
    }
  }, [appletId, deleteAssignments, handleSubmit, onClose, removeAllBanners, step]);

  // Reinitialize drawer form state whenever revealed, and clear banners when closed
  useEffect(() => {
    if (open) {
      reset(defaultValues);
      // Start at step 2 (dialogue only) if there is only one assignment
      setStep(hasSingleAssignment ? 2 : 1);
    } else {
      removeAllBanners();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmationBody = useMemo(
    () => getConfirmationBody({ selected, participantContext }),
    [selected, participantContext],
  );

  return (
    <>
      <Drawer
        anchor="right"
        onClose={handleClose}
        open={open && !hasSingleAssignment}
        data-testid={dataTestId}
        sx={{ '.MuiDrawer-paper': { width: '96rem' } }}
        {...rest}
      >
        <StyledHeader>
          <Box sx={{ position: 'relative', flex: 1 }}>
            <StyledHeadlineMedium>{t(`title${isFlow ? 'Flow' : 'Activity'}`)}</StyledHeadlineMedium>
          </Box>

          <StyledFlexTopCenter sx={{ gap: 0.8 }}>
            <IconButton
              onClick={handleClose}
              aria-label={t('close')}
              data-testid={`${dataTestId}-header-close`}
            >
              <Svg id="close" />
            </IconButton>
          </StyledFlexTopCenter>
        </StyledHeader>

        {bannersComponent}

        <StyledFlexColumn sx={{ position: 'relative', flex: 1 }}>
          <StyledFlexColumn sx={{ p: 4, gap: 4 }}>
            <StyledFlexTopCenter sx={{ gap: 2.4 }}>
              <StyledActivityThumbnailContainer sx={{ width: '8rem', height: '8rem' }}>
                {activityOrFlow && 'image' in activityOrFlow && !!activityOrFlow.image && (
                  <StyledActivityThumbnailImg
                    src={activityOrFlow.image}
                    alt={activityOrFlow.name}
                  />
                )}
                {isFlow && <ActivityFlowThumbnail activities={activityOrFlow.activities} />}
              </StyledActivityThumbnailContainer>

              <StyledFlexTopCenter sx={{ gap: 0.8 }}>
                <StyledHeadline>{activityOrFlow?.name}</StyledHeadline>
                {isFlow && <FlowChip />}
              </StyledFlexTopCenter>
            </StyledFlexTopCenter>

            <StyledFlexColumn sx={{ gap: 1.6 }}>
              <StyledFlexTopBaseline sx={{ gap: 1.6 }}>
                <StyledTitleLarge>{t('selectAssignments')}</StyledTitleLarge>
                <AssignmentCounts {...assignmentCounts} />
              </StyledFlexTopBaseline>

              <Controller
                control={control}
                name="selectedAssignments"
                render={({ field: { onChange, value } }) => (
                  <AssignmentsTable
                    assignments={assignments}
                    selected={value}
                    onChange={onChange}
                    data-testid={`${dataTestId}-assignments-table`}
                  />
                )}
              />
            </StyledFlexColumn>
          </StyledFlexColumn>
          <StyledFooterWrapper>
            <StyledFooter>
              <StyledFlexAllCenter>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClickNext}
                  disabled={isLoading || !isValid}
                  sx={{ minWidth: '19.7rem' }}
                  data-testid={`${dataTestId}-unassign`}
                >
                  {t('unassign')}
                </Button>
              </StyledFlexAllCenter>
            </StyledFooter>
          </StyledFooterWrapper>
        </StyledFlexColumn>
      </Drawer>

      <ConfirmationPopup
        isVisible={open && step === 2}
        onClose={hasSingleAssignment ? handleClose : () => setStep(1)}
        onConfirm={handleClickNext}
        title={t('confirmationTitle', { name: activityOrFlow?.name })}
        body={confirmationBody}
        isLoading={isLoading}
        data-testid={`${dataTestId}-confirmation-popup`}
      />
    </>
  );
};
