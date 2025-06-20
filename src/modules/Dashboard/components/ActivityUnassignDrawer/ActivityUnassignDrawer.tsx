import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Drawer, IconButton } from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { deleteAppletAssignmentsApi, PostAssignmentsParams } from 'api';
import { ActivityFlowThumbnail, AssignmentCounts } from 'modules/Dashboard/components';
import { banners } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { FlowChip, Svg } from 'shared/components';
import { useAsync, useModalBanners } from 'shared/hooks';
import {
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledHeadlineMedium,
  StyledHeadlineSmall,
  StyledTitleLarge,
} from 'shared/styles';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils';

import { ActivityUnassignBannerComponents } from './ActivityUnassignDrawer.const';
import { StyledFooter, StyledFooterWrapper, StyledHeader } from './ActivityUnassignDrawer.styles';
import {
  ActivityUnassignDrawerProps,
  ActivityUnassignFormValues,
} from './ActivityUnassignDrawer.types';
import { getConfirmationBody } from './ActivityUnassignDrawer.utils';
import { AssignmentsTable } from './AssignmentsTable';
import { ConfirmationPopup } from './ConfirmationPopup';

const dataTestId = 'applet-activity-unassign';

export const ActivityUnassignDrawer = ({
  appletId,
  activityOrFlow,
  onClose,
  open = false,
  ...rest
}: ActivityUnassignDrawerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityUnassign' });
  const dispatch = useAppDispatch();
  const isFlow =
    activityOrFlow &&
    (('isFlow' in activityOrFlow && activityOrFlow.isFlow) || 'activities' in activityOrFlow);
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
    selected: hasSingleAssignment ? [assignments[0]] : [],
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
          selected: yup.array().min(1).required(),
        })
        .required(),
    ),
    defaultValues,
  });

  const selected = useWatch({ control, name: 'selected' });

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

  let thumbnail: ReactNode = null;
  if (activityOrFlow) {
    if ('activities' in activityOrFlow) {
      thumbnail = <ActivityFlowThumbnail activities={activityOrFlow.activities} />;
    } else if ('isFlow' in activityOrFlow && activityOrFlow.isFlow) {
      thumbnail = <ActivityFlowThumbnail activities={activityOrFlow.images} />;
    } else {
      const image = 'images' in activityOrFlow ? activityOrFlow.images[0] : activityOrFlow.image;
      if (image) thumbnail = <StyledActivityThumbnailImg src={image} alt={activityOrFlow.name} />;
    }
  }

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
        handleSubmit(async ({ selected: selectedAssignments }) => {
          if (!appletId) return;

          let selfReports = 0;
          let multiInformant = 0;

          const assignments = selectedAssignments.map((a) => {
            if (a.respondentSubject.id === a.targetSubject.id) {
              selfReports++;
            } else {
              multiInformant++;
            }

            return {
              activityId: a.activityId,
              activityFlowId: a.activityFlowId,
              respondentSubjectId: a.respondentSubject.id,
              targetSubjectId: a.targetSubject.id,
            };
          });

          Mixpanel.track({
            action: MixpanelEventType.ConfirmUnassignActivityOrFlow,
            [MixpanelProps.AppletId]: appletId,
            [MixpanelProps.AssignmentCount]: selfReports + multiInformant,
            [MixpanelProps.SelfReportAssignmentCount]: selfReports,
            [MixpanelProps.MultiInformantAssignmentCount]: multiInformant,
            ...(activityOrFlow && {
              [MixpanelProps.EntityType]: isFlow ? 'flow' : 'activity',
              [isFlow ? MixpanelProps.ActivityFlowId : MixpanelProps.ActivityId]: activityOrFlow.id,
            }),
          });

          await deleteAssignments({
            appletId,
            assignments,
          });

          onClose(true);
        })();
        break;
    }
  }, [
    activityOrFlow,
    appletId,
    deleteAssignments,
    handleSubmit,
    isFlow,
    onClose,
    removeAllBanners,
    step,
  ]);

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

  const confirmationBody = useMemo(() => getConfirmationBody({ selected }), [selected]);

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
                {thumbnail}
              </StyledActivityThumbnailContainer>

              <StyledFlexTopCenter sx={{ gap: 0.8 }}>
                <StyledHeadlineSmall>{activityOrFlow?.name}</StyledHeadlineSmall>
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
                name="selected"
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
