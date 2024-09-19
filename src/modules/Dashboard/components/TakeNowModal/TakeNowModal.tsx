import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Dict } from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';

import { Modal, Spinner } from 'shared/components';
import { Activity, workspaces } from 'redux/modules';
import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledHeadline,
  theme,
  StyledActivityThumbnailContainer,
  StyledActivityThumbnailImg,
  StyledErrorText,
} from 'shared/styles';
import { createTemporaryMultiInformantRelationApi } from 'api';
import {
  MixpanelPayload,
  MixpanelProps,
  Mixpanel,
  checkIfDashboardAppletActivitiesUrlPassed,
  checkIfDashboardAppletParticipantDetailsUrlPassed,
  checkIfFullAccess,
  getErrorMessage,
} from 'shared/utils';
import { useAsync, useLogout } from 'shared/hooks';
import { HydratedActivityFlow } from 'modules/Dashboard/types';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import {
  ActivityFlowThumbnail,
  FullTeamSearchType,
  ParticipantDropdownOption,
  useParticipantDropdown,
} from 'modules/Dashboard/components';

import {
  OpenTakeNowModalOptions,
  TakeNowModalProps,
  UseTakeNowModalProps,
} from './TakeNowModal.types';
import { TakeNowDropdown } from './TakeNowDropdown';

type TakeNowData = {
  url: URL;
  respondent: ParticipantDropdownOption;
  sourceSubjectId: string;
  targetSubjectId: string;
};

const getAccountType = (subject: ParticipantDropdownOption | null) => {
  if (!subject) return null;

  if (subject.userId) {
    if (subject.isTeamMember) return 'Team';

    return 'Full';
  }

  return 'Limited';
};

export const useTakeNowModal = ({ dataTestId }: UseTakeNowModalProps) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const {
    featureFlags: { enableParticipantMultiInformant },
  } = useFeatureFlags();
  const { pathname } = useLocation();

  const [activityOrFlow, setActivityOrFlow] = useState<Activity | HydratedActivityFlow | null>(
    null,
  );
  const [defaultTargetSubject, setDefaultTargetSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [defaultSourceSubject, setDefaultSourceSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [multiInformantAssessmentId, setMultiInformantAssessmentId] = useState<string | null>(null);
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const canTakeNow = checkIfFullAccess(roles);
  const {
    allParticipants,
    participantsAndTeamMembers,
    fullAccountParticipantsAndTeamMembers,
    teamMembersOnly,
    loggedInTeamMember,
    handleSearch,
  } = useParticipantDropdown({ appletId, skip: !canTakeNow });

  const track = useCallback(
    (
      action: string,
      payload?: MixpanelPayload,
      newActivityOrFlow?: Activity | HydratedActivityFlow,
    ) => {
      const props: MixpanelPayload = {
        [MixpanelProps.Feature]: 'Multi-informant',
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.MultiInformantAssessmentId]: multiInformantAssessmentId,
        ...payload,
      };
      const trackedActivityOrFlow = newActivityOrFlow ?? activityOrFlow;

      if (trackedActivityOrFlow) {
        const isFlow = 'activityIds' in trackedActivityOrFlow;
        props[isFlow ? MixpanelProps.ActivityFlowId : MixpanelProps.ActivityId] =
          trackedActivityOrFlow.id;
      }

      Mixpanel.track(action, props);
    },
    [activityOrFlow, appletId, multiInformantAssessmentId],
  );

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleLogout = useLogout();
    const handleClose = () => {
      track('Take Now dialogue closed');

      setActivityOrFlow(null);
      setMultiInformantAssessmentId(null);
      onClose?.();
    };

    const [targetSubject, setTargetSubject] = useState<ParticipantDropdownOption | null>(
      defaultTargetSubject,
    );
    const [sourceSubject, setSourceSubject] = useState<ParticipantDropdownOption | null>(
      defaultSourceSubject,
    );
    const [isSelfReporting, setIsSelfReporting] = useState<boolean>(true);
    const [loggedInUser, setLoggedInUser] = useState<ParticipantDropdownOption | null>(
      defaultSourceSubject?.userId ? defaultSourceSubject : null,
    );
    const [takeNowData, setTakeNowData] = useState<TakeNowData | null>(null);

    const launchWebApp = useCallback(() => {
      if (takeNowData === null) {
        return;
      }

      setActivityOrFlow(null);

      const newTab = window.open(takeNowData.url, '_blank');
      // message received from the TakeNowSuccessModal.tsx file from the web app
      // it's needed to close the new tab after the user clicks the "Close" button
      window.addEventListener('message', function messageHandler(event) {
        if (event.origin === takeNowData.url.origin) {
          const message = event.data;

          if (message === 'close-me') {
            newTab?.close();
          }

          this.removeEventListener('message', messageHandler);
        }
      });

      handleLogout({ shouldSoftLock: true });
    }, [handleLogout, takeNowData]);

    const {
      execute: createSourceRelation,
      isLoading: isCreatingSourceRelation,
      value: sourceRelationResponse,
      error: sourceRelationError,
    } = useAsync(createTemporaryMultiInformantRelationApi);

    const {
      execute: createTargetRelation,
      isLoading: isCreatingTargetRelation,
      value: targetRelationResponse,
      error: targetRelationError,
    } = useAsync(createTemporaryMultiInformantRelationApi);

    useEffect(() => {
      if (takeNowData !== null) {
        const needSourceRelation =
          takeNowData.respondent.tag !== 'Team' &&
          takeNowData.respondent.id !== takeNowData.sourceSubjectId;
        const needTargetRelation =
          takeNowData.respondent.tag !== 'Team' &&
          takeNowData.respondent.id !== takeNowData.targetSubjectId &&
          takeNowData.sourceSubjectId !== takeNowData.targetSubjectId;

        if (
          (needSourceRelation && !sourceRelationResponse) ||
          (needTargetRelation && !targetRelationResponse)
        ) {
          return;
        }

        if (needSourceRelation && sourceRelationResponse && sourceRelationResponse.status !== 200) {
          console.error(sourceRelationError);

          return;
        }

        if (needTargetRelation && targetRelationResponse && targetRelationResponse.status !== 200) {
          console.error(targetRelationError);

          return;
        }

        launchWebApp();
      }
    }, [
      launchWebApp,
      sourceRelationError,
      sourceRelationResponse,
      takeNowData,
      targetRelationError,
      targetRelationResponse,
    ]);

    const handleSubmit = useCallback(() => {
      if (
        targetSubject &&
        sourceSubject &&
        (isSelfReporting || loggedInUser) &&
        activityOrFlow?.id
      ) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activityOrFlow.id);
        url.searchParams.set('sourceSubjectId', sourceSubject.id);
        url.searchParams.set('targetSubjectId', targetSubject.id);
        url.searchParams.set('multiInformantAssessmentId', String(multiInformantAssessmentId));

        let respondent: ParticipantDropdownOption = sourceSubject;

        // This conditional shouldn't be necessary, but TS is unable to propagate the type information from
        // (isSelfReporting || loggedInUser), so we have to check them again (or use the forbidden non-null assertion)
        if (isSelfReporting && sourceSubject.userId) {
          url.searchParams.set('respondentId', sourceSubject.userId);
          respondent = sourceSubject;
        } else if (!isSelfReporting && loggedInUser && loggedInUser.userId) {
          url.searchParams.set('respondentId', loggedInUser.userId);
          respondent = loggedInUser;
        }

        track('Multi-informant Start Activity click', {
          [MixpanelProps.SourceAccountType]: getAccountType(sourceSubject),
          [MixpanelProps.TargetAccountType]: getAccountType(targetSubject),
          [MixpanelProps.InputAccountType]: getAccountType(
            isSelfReporting ? sourceSubject : loggedInUser,
          ),
          [MixpanelProps.IsSelfReporting]: isSelfReporting || loggedInUser?.id === sourceSubject.id,
        });

        if (!isCreatingSourceRelation && !isCreatingTargetRelation) {
          if (respondent.tag !== 'Team' && respondent.id !== sourceSubject.id) {
            // Create a temporary multi-informant relation b/n the logged-in user and the source subject
            createSourceRelation({
              sourceSubjectId: respondent.id,
              subjectId: sourceSubject.id,
            });
          }

          if (
            respondent.tag !== 'Team' &&
            respondent.id !== targetSubject.id &&
            sourceSubject.id !== targetSubject.id
          ) {
            // Create a temporary multi-informant relation b/n the logged-in user and the target subject
            createTargetRelation({
              sourceSubjectId: respondent.id,
              subjectId: targetSubject.id,
            });
          }
        }

        setTakeNowData({
          url,
          respondent,
          sourceSubjectId: sourceSubject.id,
          targetSubjectId: targetSubject.id,
        });
      }
    }, [
      targetSubject,
      sourceSubject,
      isSelfReporting,
      loggedInUser,
      isCreatingSourceRelation,
      isCreatingTargetRelation,
      createSourceRelation,
      createTargetRelation,
    ]);

    if (!activityOrFlow || !allParticipants || !participantsAndTeamMembers) {
      return null;
    }

    let thumbnail: ReactNode = null;
    if ('activities' in activityOrFlow) {
      thumbnail = <ActivityFlowThumbnail activities={activityOrFlow.activities} />;
    } else if (activityOrFlow.image) {
      thumbnail = (
        <StyledActivityThumbnailImg src={activityOrFlow.image} alt={activityOrFlow.name} />
      );
    }

    const TakeNowSpinner = () => {
      if (isCreatingSourceRelation || isCreatingTargetRelation) {
        return <Spinner />;
      }

      return null;
    };

    const SubjectRelationError = () => {
      if (sourceRelationError || targetRelationError) {
        return (
          <StyledErrorText sx={{ mt: 0, mb: 0 }}>
            {getErrorMessage(t('takeNow.modal.relationErrorMessage'))}
          </StyledErrorText>
        );
      }

      return null;
    };

    return (
      <Modal
        open={true}
        width="57"
        title={t('takeNow.modal.title')}
        buttonText={t('startActivity')}
        onSubmit={handleSubmit}
        onClose={handleClose}
        disabledSubmit={
          targetSubject === null ||
          sourceSubject === null ||
          (!isSelfReporting && loggedInUser === null) ||
          isCreatingSourceRelation ||
          isCreatingTargetRelation
        }
        data-testid={`${dataTestId}-take-now-modal`}
      >
        <TakeNowSpinner />
        <StyledFlexColumn sx={{ gap: 3.2, padding: theme.spacing(1.6, 3.2, 2.4) }}>
          <StyledFlexTopCenter gap={2.4}>
            <StyledActivityThumbnailContainer>{thumbnail}</StyledActivityThumbnailContainer>
            <StyledHeadline sx={{ flexGrow: 1 }}>{activityOrFlow.name}</StyledHeadline>
          </StyledFlexTopCenter>
          <StyledFlexColumn gap={2.4}>
            <StyledFlexColumn gap={0.8}>
              <StyledFlexColumn gap={0.4}>
                <TakeNowDropdown
                  label={t('takeNow.modal.sourceSubjectLabel')}
                  name={'participant'}
                  placeholder={t('takeNow.modal.sourceSubjectPlaceholder')}
                  value={sourceSubject}
                  options={participantsAndTeamMembers}
                  onOpen={() => {
                    track('"Who will be providing responses" dropdown opened');
                  }}
                  onChange={(option) => {
                    track('"Who will be providing responses" selection changed', {
                      [MixpanelProps.SourceAccountType]: getAccountType(option),
                    });

                    setSourceSubject(option);

                    const selfReportingCondition =
                      !option ||
                      (enableParticipantMultiInformant ? !!option.userId : option.isTeamMember);

                    setIsSelfReporting(selfReportingCondition);
                  }}
                  data-testid={`${dataTestId}-take-now-modal-source-subject-dropdown`}
                  handleSearch={(query) => handleSearch(query, ['team', 'any-participant'])}
                  canShowWarningMessage={true}
                  showGroups
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      sx={{ margin: 0, width: 48, height: 48 }}
                      data-testid={`${dataTestId}-take-now-modal-participant-self-report-checkbox`}
                    />
                  }
                  sx={{ gap: 0.4 }}
                  checked={isSelfReporting}
                  onChange={(_e, checked) => {
                    track('Own responses checkbox toggled', {
                      [MixpanelProps.IsSelfReporting]: checked,
                    });
                    setIsSelfReporting(checked);
                  }}
                  disabled={
                    enableParticipantMultiInformant
                      ? !sourceSubject?.userId
                      : !sourceSubject?.isTeamMember
                  }
                  label={t('takeNow.modal.sourceSubjectCheckboxLabel')}
                />
              </StyledFlexColumn>
              {!isSelfReporting && (
                <TakeNowDropdown
                  label={t('takeNow.modal.loggedInUserLabel')}
                  name={'loggedInUser'}
                  sx={{ gap: 1, pl: 5.2 }}
                  placeholder={t('takeNow.modal.loggedInUserPlaceholder')}
                  value={loggedInUser}
                  options={
                    enableParticipantMultiInformant
                      ? fullAccountParticipantsAndTeamMembers
                      : teamMembersOnly
                  }
                  onOpen={() => {
                    track('"Who will be inputting the responses" dropdown opened');
                  }}
                  onChange={(option) => {
                    track('"Who will be inputting the responses" selection changed', {
                      [MixpanelProps.InputAccountType]: getAccountType(option),
                    });
                    setLoggedInUser(option);
                  }}
                  data-testid={`${dataTestId}-take-now-modal-logged-in-user-dropdown`}
                  handleSearch={(query) => {
                    const participantSearchTypes: [FullTeamSearchType, ...FullTeamSearchType[]] = [
                      'team',
                    ];
                    if (enableParticipantMultiInformant) {
                      participantSearchTypes.push('full-participant');
                    }

                    return handleSearch(query, participantSearchTypes);
                  }}
                  showGroups
                />
              )}
            </StyledFlexColumn>
            <TakeNowDropdown
              label={t('takeNow.modal.targetSubjectLabel')}
              name={'subject'}
              placeholder={t('takeNow.modal.targetSubjectPlaceholder')}
              value={targetSubject}
              options={participantsAndTeamMembers}
              onOpen={() => {
                track('"Who are the responses about" dropdown opened');
              }}
              onChange={(option) => {
                track('"Who are the responses about" selection changed', {
                  [MixpanelProps.TargetAccountType]: getAccountType(option),
                });
                setTargetSubject(option);
              }}
              data-testid={`${dataTestId}-take-now-modal-target-subject-dropdown`}
              handleSearch={(query) => handleSearch(query, ['team', 'any-participant'])}
            />
            <SubjectRelationError />
          </StyledFlexColumn>
        </StyledFlexColumn>
      </Modal>
    );
  };

  const openTakeNowModal = (
    activityOrFlow: Activity | HydratedActivityFlow,
    { targetSubject, sourceSubject }: OpenTakeNowModalOptions = {},
  ) => {
    const uuid = uuidv4();
    const analyticsPayload: Dict = {
      [MixpanelProps.MultiInformantAssessmentId]: uuid,
    };

    setMultiInformantAssessmentId(uuid);
    setActivityOrFlow(activityOrFlow);

    if (targetSubject) {
      setDefaultTargetSubject(targetSubject);
      analyticsPayload[MixpanelProps.TargetAccountType] = getAccountType(targetSubject);
    }

    if (sourceSubject) {
      setDefaultSourceSubject(sourceSubject);
      analyticsPayload[MixpanelProps.SourceAccountType] = getAccountType(sourceSubject);
    } else {
      setDefaultSourceSubject(enableParticipantMultiInformant ? null : loggedInTeamMember);
    }

    if (checkIfDashboardAppletActivitiesUrlPassed(pathname)) {
      analyticsPayload[MixpanelProps.Via] = 'Applet - Activities';
    } else if (checkIfDashboardAppletParticipantDetailsUrlPassed(pathname)) {
      analyticsPayload[MixpanelProps.Via] = 'Applet - Participants - Activities';
    }

    track('Take Now click', analyticsPayload, activityOrFlow);
  };

  return { TakeNowModal, openTakeNowModal };
};
