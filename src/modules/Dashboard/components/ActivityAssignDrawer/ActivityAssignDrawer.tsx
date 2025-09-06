import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Drawer, Fade, IconButton } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  AppletAssignmentsResponse,
  Assignment,
  getAppletAssignmentsApi,
  GetAssignmentsParams,
  postAppletAssignmentsApi,
  PostAssignmentsParams,
} from 'api';
import successImage from 'assets/images/email-success.webp';
import { useGetAppletActivitiesQuery } from 'modules/Dashboard/api/apiSlice';
import { AssignmentCounts, useParticipantDropdown } from 'modules/Dashboard/components';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { hydrateActivityFlows } from 'modules/Dashboard/utils';
import { Activity } from 'redux/modules';
import { Spinner, Svg, Tooltip } from 'shared/components';
import { useAsync, useModalBanners } from 'shared/hooks';
import {
  StyledBodyLarger,
  StyledFlexAllCenter,
  StyledFlexColumn,
  StyledFlexTopBaseline,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledHeadlineMedium,
  StyledLabelLarge,
  StyledLinearProgressLarge,
  StyledTitleLarge,
  StyledTitleLargish,
  variables,
} from 'shared/styles';
import { Mixpanel, MixpanelEventType, MixpanelProps } from 'shared/utils';

import { ActivitiesList } from './ActivitiesList';
import { ActivityAssignBannerComponents } from './ActivityAssignDrawer.const';
import { useActivityAssignFormSchema } from './ActivityAssignDrawer.schema';
import {
  StyledFooter,
  StyledFooterButton,
  StyledFooterButtonWrapper,
  StyledFooterWrapper,
  StyledHeader,
  StyledPane,
  StyledSuccessImage,
} from './ActivityAssignDrawer.styles';
import {
  ActivityAssignDrawerProps,
  ActivityAssignFormValues,
  ValidActivityAssignment,
} from './ActivityAssignDrawer.types';
import { ActivityCheckbox } from './ActivityCheckbox';
import { ActivityReview } from './ActivityReview';
import { AssignmentsTable } from './AssignmentsTable';
import { DeletePopup } from './DeletePopup';
import { HelpPopup } from './HelpPopup';

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

  const drawerRef = useRef<HTMLDivElement>(null);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [step, setStep] = useState(1);
  const [reviewedAssignments, setReviewedAssignments] = useState<Assignment[]>([]);
  const [emailCount, setEmailCount] = useState(0);
  const [selectedActivityOrFlow, setSelectedActivityOrFlow] = useState<
    Activity | HydratedActivityFlow
  >();
  const [progress, setProgress] = useState(0);
  const { addBanner, removeBanner, removeAllBanners, bannersComponent } = useModalBanners(
    ActivityAssignBannerComponents,
  );
  const {
    isLoading: isLoadingParticipants,
    allParticipants,
    ...dropdownProps
  } = useParticipantDropdown({
    appletId,
  });

  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    isError: isActivitiesError,
  } = useGetAppletActivitiesQuery(
    { params: { appletId: appletId as string } },
    { skip: !appletId },
  );

  const { execute: getAssignments, isLoading: isLoadingGetAssignments } = useAsync<
    GetAssignmentsParams,
    AppletAssignmentsResponse
  >(
    getAppletAssignmentsApi,
    () => removeBanner('NetworkErrorBanner'),
    () => addBanner('NetworkErrorBanner'),
  );

  const { execute: createAssignments } = useAsync<PostAssignmentsParams, AppletAssignmentsResponse>(
    postAppletAssignmentsApi,
    () => removeBanner('NetworkErrorBanner'),
    () => {
      addBanner('NetworkErrorBanner');
      setStep(2);
    },
  );

  const isLoading = isLoadingParticipants || isLoadingActivities || isLoadingGetAssignments;

  const activities: Activity[] = useMemo(
    () => activitiesData?.activitiesDetails ?? [],
    [activitiesData],
  );

  // Memoize hydrateActivityFlows to avoid recalculation on every render
  const flows: HydratedActivityFlow[] = useMemo(() => {
    if (!activitiesData?.appletDetail?.activityFlows || !activities.length) return [];

    return hydrateActivityFlows(activitiesData.appletDetail.activityFlows, activities);
  }, [activitiesData?.appletDetail?.activityFlows, activities]);

  const defaultValues = {
    activityIds: activityId ? [activityId] : [],
    flowIds: activityFlowId ? [activityFlowId] : [],
    assignments: [{ respondentSubjectId, targetSubjectId }],
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
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
  const isFooterHidden = (step === 1 && !isComplete) || step === 3;

  const scrollPane = (top = 0) => {
    drawerRef.current?.scrollTo({ top, behavior: 'smooth' });
  };

  // Memoize assignable activities and flows to avoid recalculation
  const assignableActivities = useMemo(
    () =>
      activities
        .filter(({ autoAssign }) => !autoAssign)
        .map(({ id = '' }) => id)
        .filter(Boolean) as string[],
    [activities],
  );

  const assignableFlows = useMemo(
    () =>
      flows
        .filter(({ autoAssign }) => !autoAssign)
        .map(({ id = '' }) => id)
        .filter(Boolean) as string[],
    [flows],
  );

  const activitiesCount = assignableActivities.length + assignableFlows.length;
  const selectAllIsChecked = activitiesCount !== 0 && selectionCount === activitiesCount;
  const disableSelectAll =
    activities.every(({ autoAssign }) => autoAssign) && flows.every(({ autoAssign }) => autoAssign);

  const handleSelectAll = () => {
    if (selectionCount === activitiesCount) {
      setValue('activityIds', [], { shouldDirty: true });
      setValue('flowIds', [], { shouldDirty: true });
    } else {
      setValue('activityIds', assignableActivities, { shouldDirty: true });
      setValue('flowIds', assignableFlows, { shouldDirty: true });
    }
  };

  const handleClose = () => {
    // TODO: Display confirmation popup https://mindlogger.atlassian.net/browse/M2-7399
    // if (
    //   isDirty &&
    //   !window.confirm('[TODO: Replace me with popup]\nChanges will be lost, are you sure?')
    // ) {
    //   return;
    // }

    onClose();
  };

  const handleDelete = () => {
    if (!selectedActivityOrFlow) return;

    const isFlow = 'activities' in selectedActivityOrFlow;
    if (isFlow) {
      setValue(
        'flowIds',
        flowIds.filter((id) => id !== selectedActivityOrFlow.id),
        { shouldDirty: true },
      );
    } else {
      setValue(
        'activityIds',
        activityIds.filter((id) => id !== selectedActivityOrFlow.id),
        { shouldDirty: true },
      );
    }

    removeAllBanners();
    handleSubmit(reviewAssignments)();
  };

  const reviewAssignments: SubmitHandler<ActivityAssignFormValues> = useCallback(
    async ({ assignments, flowIds, activityIds }) => {
      if (!appletId) return;

      // Delete empty assignments after validation
      const validAssignments = assignments.filter(
        (a) => a.respondentSubjectId || a.targetSubjectId,
      ) as ValidActivityAssignment[];
      setValue('assignments', validAssignments);

      // Convert respondent-subject assignments to a flat list of fully hydrated assignments
      // (one for each activity/flow)
      const hydratedAssignments: Assignment[] = [];

      // Optimize assignment creation by using a more efficient approach
      for (const assignment of validAssignments) {
        for (const activityFlowId of flowIds) {
          hydratedAssignments.push({
            ...assignment,
            activityId: null,
            activityFlowId,
          });
        }

        for (const activityId of activityIds) {
          hydratedAssignments.push({
            ...assignment,
            activityId,
            activityFlowId: null,
          });
        }
      }

      // Calculate # of pre-existing assignments and emails being sent
      // Only fetch assignments for selected activities/flows to reduce payload
      const getAssignmentsData = await getAssignments({
        appletId,
        flows: flowIds.join(',') || undefined,
        activities: activityIds.join(',') || undefined,
      });
      const existingAssignments = getAssignmentsData.data.result.assignments;

      // Optimize duplicate checking with a Set-based approach
      const existingAssignmentKeys = new Set(
        existingAssignments.map(
          (a) =>
            `${a.respondentSubjectId}_${a.targetSubjectId}_${a.activityId}_${a.activityFlowId}`,
        ),
      );

      let duplicates = 0;
      const emailRecipients = new Set<string>();

      for (const assignment of hydratedAssignments) {
        const assignmentKey = `${assignment.respondentSubjectId}_${assignment.targetSubjectId}_${assignment.activityId}_${assignment.activityFlowId}`;

        if (existingAssignmentKeys.has(assignmentKey)) {
          duplicates++;
        } else {
          emailRecipients.add(assignment.respondentSubjectId);
        }
      }

      if (duplicates) {
        if (duplicates === hydratedAssignments.length) {
          addBanner('ExistingAssignmentsBanner', { allAssigned: true, duration: 10000 });
          setStep(1);

          return;
        } else {
          addBanner('ExistingAssignmentsBanner');
        }
      }

      setEmailCount(emailRecipients.size);
      setReviewedAssignments(hydratedAssignments);
      setStep(2);
    },
    [addBanner, appletId, getAssignments, setValue],
  );

  const handleClickNext = useCallback(() => {
    removeAllBanners();

    switch (step) {
      case 1:
        handleSubmit(reviewAssignments)();
        break;

      case 2:
        handleSubmit(async () => {
          if (!appletId) return;

          let selfReportAssignmentCount = 0;
          let multiInformantAssignmentCount = 0;

          for (const assignment of reviewedAssignments) {
            if (assignment.respondentSubjectId === assignment.targetSubjectId) {
              selfReportAssignmentCount++;
            } else {
              multiInformantAssignmentCount++;
            }
          }

          Mixpanel.track({
            action: MixpanelEventType.ConfirmAssignActivityOrFlow,
            [MixpanelProps.AppletId]: appletId,
            [MixpanelProps.AssignmentCount]: reviewedAssignments.length,
            [MixpanelProps.SelfReportAssignmentCount]: selfReportAssignmentCount,
            [MixpanelProps.MultiInformantAssignmentCount]: multiInformantAssignmentCount,
            [MixpanelProps.ActivityCount]: activityIds.length,
            [MixpanelProps.FlowCount]: flowIds.length,
          });

          setStep(3);

          setProgress(0);
          // Create illusion of BE request making progress (never quite reaching 100% till the end)
          const intervalId = setInterval(
            () => setProgress((progress) => progress + (100 - progress) * 0.1),
            300,
          );
          await createAssignments({ appletId, assignments: reviewedAssignments });
          clearInterval(intervalId);
          setProgress(100);

          // Allow progress bar fill animation to complete before transitioning to success screen
          setTimeout(() => setStep(4), 400);
        })();
        break;

      case 4:
        onClose(true);
        break;
    }
  }, [
    activityIds.length,
    appletId,
    createAssignments,
    flowIds.length,
    handleSubmit,
    onClose,
    removeAllBanners,
    reviewAssignments,
    reviewedAssignments,
    step,
  ]);

  const handleClickBack = useCallback(() => {
    scrollPane();
    setEmailCount(0);
    setReviewedAssignments([]);
    setStep((step) => step - 1);
  }, []);

  useEffect(() => {
    if (isActivitiesError) {
      addBanner('NetworkErrorBanner');
    }

    return () => removeBanner('NetworkErrorBanner');
  }, [isActivitiesError, addBanner, removeBanner]);

  // Reinitialize drawer form state whenever revealed, and clear banners when closed
  useEffect(() => {
    if (!allParticipants.length) return;

    if (open) {
      const { activityIds, flowIds, assignments } = defaultValues;

      reset(defaultValues);
      setStep(1);
      setEmailCount(0);
      setReviewedAssignments([]);

      setTimeout(() => {
        if (assignments[0]?.respondentSubjectId) {
          addBanner('RespondentAutofillBanner', {
            hasActivity: activityIds.length || flowIds.length,
            hasSubject: !!assignments[0].targetSubjectId,
            isSelfReport: assignments[0].respondentSubjectId === assignments[0].targetSubjectId,
          });
        } else if (assignments[0]?.targetSubjectId) {
          addBanner('SubjectAutofillBanner', {
            hasActivity: activityIds.length || flowIds.length,
          });
        } else if (activityIds.length || flowIds.length) {
          addBanner('ActivityAutofillBanner');
        }
      }, 300);
    } else {
      removeAllBanners();
    }
  }, [open, allParticipants]); // eslint-disable-line react-hooks/exhaustive-deps

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

  let nextButtonKey: string;
  switch (step) {
    case 1:
      nextButtonKey = 'next';
      break;
    case 2:
    case 3:
      nextButtonKey = 'sendEmails';
      break;
    case 4:
    default:
      nextButtonKey = 'done';
      break;
  }

  return (
    <Drawer
      PaperProps={{ ref: drawerRef }}
      anchor="right"
      onClose={handleClose}
      open={open}
      data-testid={dataTestId}
      sx={{ '.MuiDrawer-paper': { width: '96rem' } }}
      {...rest}
    >
      {isLoading && <Spinner />}

      <Fade in={step === 1 || step === 2}>
        <StyledHeader>
          <Box sx={{ position: 'relative', flex: 1 }}>
            <Fade in={step === 1}>
              <StyledHeadlineMedium>{t(`titleStep1`)}</StyledHeadlineMedium>
            </Fade>
            <Fade in={step >= 2}>
              <StyledFlexTopCenter sx={{ position: 'absolute', inset: 0 }}>
                <IconButton
                  color="outlined"
                  onClick={handleClickBack}
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
            <IconButton
              onClick={handleClose}
              aria-label={t('close')}
              data-testid={`${dataTestId}-header-close`}
            >
              <Svg id="close" />
            </IconButton>
          </StyledFlexTopCenter>
        </StyledHeader>
      </Fade>

      {bannersComponent}

      <StyledFlexColumn sx={{ position: 'relative', flex: 1 }}>
        {/* Step 1 - Select activities and add respondents */}
        <Fade in={step === 1} onEntered={() => scrollPane()}>
          <StyledPane sx={{ gap: 4.8 }}>
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
                    disabled={disableSelectAll}
                  >
                    {t('selectAll')}
                    <ActivityCheckbox
                      checked={selectAllIsChecked}
                      onChange={handleSelectAll}
                      disabled={disableSelectAll}
                    />
                  </Button>
                </StyledFlexTopBaseline>
              </StyledFlexTopBaseline>

              <Controller
                control={control}
                name="activityIds"
                render={({ field: { onChange: onChangeActivityids, value: activityIds } }) => (
                  <Controller
                    control={control}
                    name="flowIds"
                    render={({ field: { onChange: onChangeFlowIds, value: flowIds } }) => (
                      <ActivitiesList
                        activities={activities}
                        flows={flows}
                        activityIds={activityIds}
                        flowIds={flowIds}
                        onChangeActivityIds={onChangeActivityids}
                        onChangeFlowIds={onChangeFlowIds}
                        data-testid={`${dataTestId}-activities-list`}
                      />
                    )}
                  />
                )}
              />
            </StyledFlexColumn>

            {/* Add respondents */}
            <StyledFlexColumn sx={{ gap: 1.6 }}>
              <StyledFlexTopBaseline sx={{ gap: 1.6 }}>
                <StyledTitleLarge>{t('addRespondents')}</StyledTitleLarge>
                <AssignmentCounts {...assignmentCounts} />
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
                      onAdd={() =>
                        setTimeout(() => {
                          scrollPane(drawerRef.current?.clientHeight);
                        }, 50)
                      }
                      errors={{ duplicateRows }}
                      data-testid={`${dataTestId}-assignments-table`}
                    />
                  );
                }}
              />
            </StyledFlexColumn>
          </StyledPane>
        </Fade>

        {/* Step 2 - Review and send emails */}
        <Fade in={step === 2} onEntered={() => scrollPane()} unmountOnExit>
          <StyledPane sx={{ gap: 1.6 }}>
            <StyledFlexTopCenter sx={{ gap: 0.8 }}>
              <StyledTitleLargish>{t('reviewSummary', { count: emailCount })}</StyledTitleLargish>
              <Tooltip tooltipTitle={t('reviewSummaryTooltip')}>
                <StyledFlexAllCenter component="span">
                  <Svg
                    id="help-outlined"
                    width={18}
                    height={18}
                    fill={variables.palette.on_surface_variant}
                  />
                </StyledFlexAllCenter>
              </Tooltip>
            </StyledFlexTopCenter>

            {/* Review assignments for each flow */}
            {!!flowIds.length &&
              flows
                .filter(({ id = '' }) => flowIds.includes(id))
                .map((flow, index) => (
                  <ActivityReview
                    {...dropdownProps}
                    allParticipants={allParticipants}
                    key={flow.id}
                    isSingleActivity={flowIds.length + activityIds.length === 1}
                    index={index}
                    flow={flow}
                    assignments={assignments as ValidActivityAssignment[]}
                    onDelete={(flow) => {
                      setSelectedActivityOrFlow(flow);
                      setShowDeletePopup(true);
                    }}
                    data-testid={`${dataTestId}-review-flow-${flow.id}`}
                  />
                ))}

            {/* Review assignments for each activity */}
            {!!activityIds.length &&
              activities
                .filter(({ id = '' }) => activityIds.includes(id))
                .map((activity, index) => (
                  <ActivityReview
                    {...dropdownProps}
                    allParticipants={allParticipants}
                    key={activity.id}
                    isSingleActivity={flowIds.length + activityIds.length === 1}
                    index={index + flowIds.length}
                    activity={activity}
                    assignments={assignments as ValidActivityAssignment[]}
                    onDelete={(activity) => {
                      setSelectedActivityOrFlow(activity);
                      setShowDeletePopup(true);
                    }}
                    data-testid={`${dataTestId}-review-activity-${activity.id}`}
                  />
                ))}
          </StyledPane>
        </Fade>

        {/* Step 3 - Assigning */}
        <Fade in={step === 3} onEntered={() => scrollPane()} unmountOnExit>
          <StyledPane
            sx={{ placeContent: 'center', alignItems: 'center', textAlign: 'center', mt: -9.5 }}
          >
            <StyledTitleLargish>{t('assigning')}</StyledTitleLargish>
            <StyledLinearProgressLarge
              variant="determinate"
              value={progress}
              sx={{ width: '24.3rem', mt: 3.7 }}
            />
          </StyledPane>
        </Fade>

        {/* Step 4 - Success */}
        <Fade in={step === 4} onEntered={() => scrollPane()} unmountOnExit>
          <StyledPane sx={{ placeContent: 'center', textAlign: 'center', gap: 2.1, mt: -9.5 }}>
            <Box>
              <StyledSuccessImage src={successImage} alt="" />
              <StyledHeadlineLarge as="h1" sx={{ m: 0 }}>
                {t('success')}
              </StyledHeadlineLarge>
            </Box>
            <StyledBodyLarger>{t('emailsSent')}</StyledBodyLarger>
          </StyledPane>
        </Fade>

        <StyledFooterWrapper>
          <StyledFooter hidden={isFooterHidden} sx={step > 2 ? { borderTop: 0 } : undefined}>
            <StyledFooterButtonWrapper step={step}>
              <StyledFooterButton
                step={step}
                variant="contained"
                onClick={handleClickNext}
                disabled={isLoading || !!errors.assignments || isFooterHidden}
                sx={{ minWidth: '19.7rem' }}
                data-testid={`${dataTestId}-${nextButtonKey}`}
              >
                {t(nextButtonKey)}
              </StyledFooterButton>
            </StyledFooterButtonWrapper>
          </StyledFooter>
        </StyledFooterWrapper>
      </StyledFlexColumn>

      <HelpPopup
        isVisible={showHelpPopup}
        setIsVisible={setShowHelpPopup}
        data-testid={`${dataTestId}-help-popup`}
      />
      <DeletePopup
        isVisible={showDeletePopup}
        setIsVisible={setShowDeletePopup}
        onConfirm={handleDelete}
        activityName={selectedActivityOrFlow?.name}
        data-testid={`${dataTestId}-delete-popup`}
      />
    </Drawer>
  );
};
