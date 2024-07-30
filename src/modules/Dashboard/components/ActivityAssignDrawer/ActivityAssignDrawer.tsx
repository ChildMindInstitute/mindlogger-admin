import { useTranslation } from 'react-i18next';
import { Box, Button, Drawer, Fade, IconButton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  StyledFlexColumn,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledHeadlineMedium,
  StyledLabelLarge,
  StyledTitleLarge,
  variables,
} from 'shared/styles';
import { Spinner, Svg } from 'shared/components';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { useAsync } from 'shared/hooks';
import { getAppletActivitiesApi } from 'api';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { Activity } from 'redux/modules';
import { useParticipantDropdown } from 'modules/Dashboard/components';

import { AssignmentsTable } from './AssignmentsTable';
import { ActivityCheckbox } from './ActivityCheckbox';
import { ActivityAssignDrawerProps, ActivityAssignFormValues } from './ActivityAssignDrawer.types';
import { useActivityAssignFormSchema } from './ActivityAssignDrawer.schema';
import {
  StyledFooter,
  StyledFooterButton,
  StyledFooterButtonWrapper,
  StyledFooterWrapper,
  StyledHeader,
} from './ActivityAssignDrawer.styles';
import { HelpPopup } from './HelpPopup';
import { ActivitiesList } from './ActivitiesList';
import { useActivityAssignBanners } from './ActivityAssignDrawer.hooks';

const dataTestId = 'applet-activity-assign';

export const ActivityAssignDrawer = ({
  appletId,
  activityId,
  activityFlowId,
  respondentSubjectId = null,
  targetSubjectId = null,
  onClose,
  open,
  ...rest
}: ActivityAssignDrawerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const { addBanner, removeBanner, removeAllBanners, bannersComponent } =
    useActivityAssignBanners();
  const {
    isLoading: isLoadingParticipants,
    allParticipants,
    ...dropdownProps
  } = useParticipantDropdown({
    appletId,
  });

  const {
    execute: getActivities,
    isLoading: isLoadingActivities,
    value: activitiesData,
  } = useAsync(
    getAppletActivitiesApi,
    () => removeBanner('NetworkErrorBanner'),
    () => addBanner('NetworkErrorBanner'),
  );

  const isLoading = isLoadingParticipants || isLoadingActivities;

  const activities: Activity[] = activitiesData?.data.result?.activitiesDetails ?? [];
  const flows: HydratedActivityFlow[] = hydrateActivityFlows(
    activitiesData?.data.result?.appletDetail?.activityFlows ?? [],
    activities,
  );
  const activitiesCount = activities.length + flows.length;

  const defaultValues = {
    activityIds: activityId ? [activityId] : [],
    flowIds: activityFlowId ? [activityFlowId] : [],
    assignments: [{ respondentSubjectId, targetSubjectId }],
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, errors, isDirty },
    reset,
  } = useForm<ActivityAssignFormValues>({
    resolver: yupResolver(useActivityAssignFormSchema()),
    defaultValues,
    mode: 'onSubmit',
  });

  const [activityIds, flowIds, assignments] = useWatch({
    control,
    name: ['activityIds', 'flowIds', 'assignments'],
  });
  const selectionCount = activityIds.length + flowIds.length;
  const assignmentCounts = useMemo(() => {
    const counts = { incomplete: 0, selfReports: 0, multiInformant: 0 };
    for (const assignment of assignments) {
      if (!assignment.respondentSubjectId && !assignment.targetSubjectId) continue;

      if (!assignment.respondentSubjectId || !assignment.targetSubjectId) {
        counts.incomplete++;
      } else if (assignment.respondentSubjectId === assignment.targetSubjectId) {
        counts.selfReports++;
      } else {
        counts.multiInformant++;
      }
    }

    return {
      ...counts,
      complete: counts.selfReports + counts.multiInformant,
    };
  }, [assignments]);

  const isComplete = !!selectionCount && assignmentCounts.complete && !assignmentCounts.incomplete;

  const handleSelectAll = () => {
    if (selectionCount === activitiesCount) {
      setValue('activityIds', [], { shouldDirty: true });
      setValue('flowIds', [], { shouldDirty: true });
    } else {
      setValue(
        'activityIds',
        activities.map(({ id = '' }) => id),
        { shouldDirty: true },
      );
      setValue(
        'flowIds',
        flows.map(({ id = '' }) => id),
        { shouldDirty: true },
      );
    }
  };

  const handleClose = () => {
    // TODO: Display confirmation popup https://mindlogger.atlassian.net/browse/M2-7399
    if (
      isDirty &&
      !window.confirm('[TODO: Replace me with popup]\nChanges will be lost, are you sure?')
    ) {
      return;
    }

    onClose();
  };

  const handleClickNext = () => {
    if (step === 1) {
      removeAllBanners();
      handleSubmit(() => {
        // Delete incomplete assignments after validation
        setValue(
          'assignments',
          assignments.filter((a) => a.respondentSubjectId || a.targetSubjectId),
        );
        setStep(2);
      })();
    } else {
      // TODO: Submit to BE https://mindlogger.atlassian.net/browse/M2-7261
      handleSubmit(() => {})();
    }
  };

  // Initialize activities/flows data
  useEffect(() => {
    if (!appletId) return;

    getActivities({ params: { appletId } });
  }, [appletId, getActivities]);

  // Reinitialize drawer form state whenever revealed, and clear banners when closed
  useEffect(() => {
    if (open) {
      const { activityIds, flowIds, assignments } = defaultValues;

      reset(defaultValues);

      setTimeout(() => {
        if (assignments[0]?.respondentSubjectId) {
          const name = allParticipants.find(({ id }) => id === assignments[0].respondentSubjectId)
            ?.nickname;
          addBanner('RespondentAutofillBanner', {
            name,
            hasActivity: activityIds.length || flowIds.length,
          });
        } else if (assignments[0]?.targetSubjectId) {
          const name = allParticipants.find(({ id }) => id === assignments[0].targetSubjectId)
            ?.nickname;
          addBanner('SubjectAutofillBanner', {
            name,
            hasActivity: activityIds.length || flowIds.length,
          });
        } else if (activityIds.length || flowIds.length) {
          addBanner('ActivityAutofillBanner');
        }
      }, 300);
    } else {
      removeAllBanners();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear subject autofill banner once all subject assignments have a respondent
  useEffect(() => {
    if (!assignments.some((value) => value.targetSubjectId && !value.respondentSubjectId)) {
      removeBanner('SubjectAutofillBanner');
    }
  }, [assignments, removeBanner]);

  useEffect(() => {
    if (errors.assignments?.type === 'DuplicateRowsError') {
      addBanner('DuplicateRowsErrorBanner');
    } else {
      removeBanner('DuplicateRowsErrorBanner');
    }
  }, [addBanner, errors.assignments, removeBanner]);

  return (
    <Drawer
      anchor="right"
      onClose={handleClose}
      open={open}
      data-testid={dataTestId}
      sx={{ '.MuiDrawer-paper': { width: '96rem' } }}
      {...rest}
    >
      {isLoading && <Spinner />}

      <StyledHeader>
        <Box sx={{ position: 'relative', flex: 1 }}>
          <Fade in={step === 1}>
            <StyledHeadlineMedium>{t(`titleStep1`)}</StyledHeadlineMedium>
          </Fade>
          <Fade in={step === 2}>
            <StyledFlexTopCenter sx={{ position: 'absolute', inset: 0 }}>
              <IconButton
                color="outlined"
                onClick={() => setStep(1)}
                data-testid={`${dataTestId}-back`}
              >
                <Svg id="arrow-navigate-left" />
              </IconButton>
              <StyledHeadlineMedium sx={{ mx: 'auto' }}>{t(`titleStep2`)}</StyledHeadlineMedium>
            </StyledFlexTopCenter>
          </Fade>
        </Box>

        <StyledFlexTopCenter sx={{ gap: 0.8 }}>
          <IconButton
            onClick={() => setShowHelpPopup(true)}
            data-testid={`${dataTestId}-header-help`}
          >
            <Svg id="help-outlined" />
          </IconButton>
          <IconButton onClick={handleClose} data-testid={`${dataTestId}-header-close`}>
            <Svg id="close" />
          </IconButton>
        </StyledFlexTopCenter>
      </StyledHeader>

      {bannersComponent}

      <StyledFlexColumn sx={{ position: 'relative', overflowY: 'auto', flex: 1 }}>
        {/* Step 1 – Select activities and add respondents */}
        <Fade in={step === 1}>
          <StyledFlexColumn sx={{ p: 4, gap: 4.8 }}>
            {/* Select activities */}
            <StyledFlexColumn sx={{ gap: 0.8 }}>
              <StyledFlexTopBaseline>
                <StyledFlexTopBaseline sx={{ gap: 1.6, mr: 'auto' }}>
                  <StyledTitleLarge>{t('selectActivities')}</StyledTitleLarge>
                  {!!selectionCount && (
                    <StyledLabelLarge color={variables.palette.on_surface_variant}>
                      {t('selected', { count: selectionCount })}
                    </StyledLabelLarge>
                  )}
                </StyledFlexTopBaseline>

                <StyledFlexTopBaseline sx={{ gap: 2.4 }}>
                  {/* TODO: Add scheduling button https://mindlogger.atlassian.net/browse/M2-7260
                  {!!selectionCount && <Button>…</Button>} */}

                  <Button
                    variant="textNeutral"
                    size="small"
                    onClick={handleSelectAll}
                    data-testid={`${dataTestId}-select-all`}
                  >
                    {t('selectAll')}
                    <ActivityCheckbox
                      checked={selectionCount === activitiesCount}
                      onChange={handleSelectAll}
                    />
                  </Button>
                </StyledFlexTopBaseline>
              </StyledFlexTopBaseline>

              <ActivitiesList
                activities={activities}
                flows={flows}
                control={control}
                data-testid={`${dataTestId}-activities-list`}
              />
            </StyledFlexColumn>

            {/* Add respondents */}
            <StyledFlexColumn sx={{ gap: 1.6 }}>
              <StyledFlexTopBaseline sx={{ gap: 1.6 }}>
                <StyledTitleLarge>{t('addRespondents')}</StyledTitleLarge>
                {!!assignmentCounts.selfReports && (
                  <StyledLabelLarge color={variables.palette.on_surface_variant}>
                    {t('selfReports', { count: assignmentCounts.selfReports })}
                  </StyledLabelLarge>
                )}
                {!!assignmentCounts.multiInformant && (
                  <StyledLabelLarge color={variables.palette.on_surface_variant}>
                    {t('multiInformant', { count: assignmentCounts.multiInformant })}
                  </StyledLabelLarge>
                )}
              </StyledFlexTopBaseline>

              <Controller
                control={control}
                name="assignments"
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  const duplicateRows =
                    errors.assignments?.type === 'DuplicateRowsError'
                      ? (error?.message?.split(',') as `${string}_${string}`[])
                      : undefined;

                  return (
                    <AssignmentsTable
                      {...dropdownProps}
                      allParticipants={allParticipants}
                      assignments={value}
                      onChange={onChange}
                      errors={{ duplicateRows }}
                      data-testid={`${dataTestId}-assignments-table`}
                    />
                  );
                }}
              />
            </StyledFlexColumn>
          </StyledFlexColumn>
        </Fade>

        {/* Step 2 – Review and send emails */}
        <Fade in={step === 2}>
          {/* TODO: Review step https://mindlogger.atlassian.net/browse/M2-7261 */}
          {/* When implementing Review step, the `position: 'absolute', inset: 0` props will
          need to be attached to the step's topmost StyledFlexColumn that is guaranteed to be the
          shortest for Fade transitions to preserve layout. It may be the case that when 1 activity
          is selected, Step 2 is shortest, while 2+ selected activities makes Step 1 shortest. The
          tallest component needs to be the one with static positioning to ensure the parent
          container can accommodate both panes. A less fragile but not terribly complex approach
          would be preferred. */}
          <StyledFlexColumn sx={{ position: 'absolute', inset: 0, p: 4, gap: 1.6 }}>
            TODO: Review step
          </StyledFlexColumn>
        </Fade>

        <StyledFooterWrapper>
          <StyledFooter hidden={!isComplete}>
            <StyledFooterButtonWrapper step={step}>
              <StyledFooterButton
                step={step}
                variant="contained"
                onClick={handleClickNext}
                disabled={step === 1 ? !isComplete : !isComplete || !isValid}
                sx={{ minWidth: '19.7rem' }}
                data-testid={`${dataTestId}-${step === 1 ? 'next' : 'send-emails'}`}
              >
                {t(step === 1 ? 'next' : 'sendEmails')}
              </StyledFooterButton>
            </StyledFooterButtonWrapper>
          </StyledFooter>
        </StyledFooterWrapper>
      </StyledFlexColumn>

      <HelpPopup
        isVisible={showHelpPopup}
        setIsVisible={setShowHelpPopup}
        data-testid={dataTestId}
      />
    </Drawer>
  );
};
