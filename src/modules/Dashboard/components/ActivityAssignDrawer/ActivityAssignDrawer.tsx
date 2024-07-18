import { useTranslation } from 'react-i18next';
import { Box, Button, Drawer, Fade, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

const dataTestId = 'applet-activity-assign';

export const ActivityAssignDrawer = ({
  appletId,
  activityId,
  activityFlowId,
  respondentId,
  targetSubjectId,
  onClose,
  open,
  ...rest
}: ActivityAssignDrawerProps) => {
  const { t } = useTranslation('app', { keyPrefix: 'activityAssign' });
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const {
    execute: getActivities,
    isLoading: isLoadingActivities,
    value,
  } = useAsync(getAppletActivitiesApi);
  const [step, setStep] = useState<1 | 2>(1);

  const activities: Activity[] = value?.data.result?.activitiesDetails ?? [];
  const flows: HydratedActivityFlow[] = hydrateActivityFlows(
    value?.data.result?.appletDetail?.activityFlows ?? [],
    activities,
  );
  const activitiesCount = activities.length + flows.length;

  const defaultValues = {
    activityIds: activityId ? [activityId] : [],
    flowIds: activityFlowId ? [activityFlowId] : [],
    assignments: respondentId || targetSubjectId ? [{ respondentId, targetSubjectId }] : [],
  };

  const {
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { isValid, errors, isDirty },
    reset,
  } = useForm<ActivityAssignFormValues>({
    resolver: yupResolver(useActivityAssignFormSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const [activityIds, flowIds] = useWatch({ control, name: ['activityIds', 'flowIds'] });
  const selectionCount = activityIds.length + flowIds.length;

  const isComplete = !!selectionCount;

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
      setStep(2);
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

  // Reinitialize drawer form state whenever revealed
  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Drawer
      anchor="right"
      onClose={handleClose}
      open={open}
      data-testid={dataTestId}
      sx={{ '.MuiDrawer-paper': { width: '96rem' } }}
      {...rest}
    >
      {isLoadingActivities && <Spinner />}

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

      <StyledFlexColumn sx={{ position: 'relative', overflowY: 'auto', flex: 1 }}>
        <Fade in={step === 1}>
          <StyledFlexColumn sx={{ p: 4, gap: 4.8 }}>
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
                    <ActivityCheckbox isChecked={selectionCount === activitiesCount} />
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

            <StyledFlexColumn sx={{ gap: 1.6 }}>
              <StyledTitleLarge>{t('addRespondents')}</StyledTitleLarge>
            </StyledFlexColumn>
          </StyledFlexColumn>
        </Fade>

        <Fade in={step === 2}>
          {/* TODO: Review step https://mindlogger.atlassian.net/browse/M2-7261 */}
          {/* When implementing Review step, the `position: 'absolute', inset: 0` props will
          need to be moved from below to Step 1's StyledFlexColumn. With these Fade transitions as
          implemented, the step whose content is guaranteed to be the tallest (which will be the
          Review step when completed) needs to be the one with static positioning to ensure the
          parent container accommodates both panes. */}
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
                disabled={!isComplete || !isValid}
                sx={{ minWidth: '19.7rem' }}
                data-testid={`${dataTestId}-${step === 1 ? 'next' : 'send-invitations'}`}
              >
                {t(step === 1 ? 'next' : 'sendInvitations')}
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
