import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Dict } from 'mixpanel-browser';
import { v4 as uuidv4 } from 'uuid';

import { Modal } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import { StyledFlexColumn, StyledFlexTopCenter, StyledHeadline, theme } from 'shared/styles';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { getWorkspaceManagersApi, getWorkspaceRespondentsApi } from 'api';
import {
  MixpanelPayload,
  MixpanelProps,
  Mixpanel,
  checkIfDashboardAppletActivitiesUrlPassed,
  checkIfDashboardAppletParticipantDetailsUrlPassed,
  checkIfFullAccess,
  joinWihComma,
} from 'shared/utils';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { useAsync, useLogout } from 'shared/hooks';
import { Manager, Respondent } from 'modules/Dashboard/types';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { FlowSummaryThumbnail } from 'modules/Dashboard/components/FlowSummaryCard/FlowSummaryThumbnail';

import { HydratedActivityFlow } from '../FlowGrid/FlowGrid.types';
import {
  OpenTakeNowModalOptions,
  TakeNowModalProps,
  UseTakeNowModalProps,
} from './TakeNowModal.types';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledUserDropdown } from './LabeledDropdown/LabeledUserDropdown';
import { BaseActivity } from '../ActivityGrid';
import { ParticipantDropdownOption } from './LabeledDropdown/LabeledUserDropdown.types';

const ALLOWED_TEAM_MEMBER_ROLES: readonly Roles[] = [
  Roles.SuperAdmin,
  Roles.Owner,
  Roles.Manager,
] as const;

type AnyTeamSearchType = 'team' | 'any-participant';
type FullTeamSearchType = 'team' | 'full-participant';

const getAccountType = (subject: ParticipantDropdownOption | null) => {
  if (!subject) return null;

  if (subject.userId) {
    if (subject.tag === 'Team') return 'Team';

    return 'Full';
  }

  return 'Limited';
};

export const useTakeNowModal = ({ dataTestId }: UseTakeNowModalProps) => {
  const { t } = useTranslation('app');
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();
  const {
    featureFlags: { enableParticipantMultiInformant },
  } = useFeatureFlags();
  const { pathname } = useLocation();

  const [activityOrFlow, setActivityOrFlow] = useState<BaseActivity | HydratedActivityFlow | null>(
    null,
  );
  const [allParticipants, setAllParticipants] = useState<ParticipantDropdownOption[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<Manager[]>([]);
  const [defaultTargetSubject, setDefaultTargetSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [defaultSourceSubject, setDefaultSourceSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [multiInformantAssessmentId, setMultiInformantAssessmentId] = useState<string | null>(null);
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;
  const canTakeNow = checkIfFullAccess(roles);

  const track = useCallback(
    (
      action: string,
      payload?: MixpanelPayload,
      newActivityOrFlow?: BaseActivity | HydratedActivityFlow,
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

  const participantToOption = useCallback((participant: Respondent): ParticipantDropdownOption => {
    const stringNicknames = joinWihComma(participant.nicknames, true);
    const stringSecretIds = joinWihComma(participant.secretIds, true);

    return {
      id: participant.details[0].subjectId,
      userId: participant.id,
      secretId: stringSecretIds,
      nickname: stringNicknames,
      tag: participant.details[0].subjectTag,
    };
  }, []);

  const { execute: fetchParticipants, isLoading: isFetchingParticipants } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      if (response?.data) {
        const options = (response.data as ParticipantsData).result.map(participantToOption);

        setAllParticipants(options);
      }
    },
  );

  const { execute: fetchManagers, isLoading: isFetchingManagers } = useAsync(
    getWorkspaceManagersApi,
    (response) => {
      setAllTeamMembers(response?.data?.result || []);
    },
  );

  const {
    execute: fetchLoggedInTeamMember,
    isLoading: isFetchingLoggedInTeamMember,
    value: loggedInTeamMemberResponse,
  } = useAsync(getWorkspaceRespondentsApi, (response) => {
    if (response?.data) {
      const loggedInTeamMember = participantToOption((response.data as ParticipantsData).result[0]);
      if (!enableParticipantMultiInformant) {
        setDefaultSourceSubject(loggedInTeamMember);
      }
      setAllParticipants((prev) => {
        if (prev.some((participant) => participant.id === loggedInTeamMember.id)) {
          return prev;
        }

        return [loggedInTeamMember, ...prev];
      });
    }
  });

  const allowedTeamMembers = useMemo(
    () =>
      allTeamMembers.filter((manager) =>
        manager.roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)),
      ),
    [allTeamMembers],
  );

  const participantsOnly = useMemo(
    () => allParticipants.filter((participant) => participant.tag !== 'Team'),
    [allParticipants],
  );

  const fullAccountParticipantsOnly = useMemo(
    () => participantsOnly.filter((participant) => !!participant.userId),
    [participantsOnly],
  );

  const teamMembersOnly = useMemo(
    () =>
      allParticipants.filter(
        (participant) =>
          participant.tag === 'Team' &&
          allowedTeamMembers.some((manager) => manager.id === participant.userId),
      ),
    [allParticipants, allowedTeamMembers],
  );

  const participantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...participantsOnly],
    [participantsOnly, teamMembersOnly],
  );

  const fullAccountParticipantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...fullAccountParticipantsOnly],
    [fullAccountParticipantsOnly, teamMembersOnly],
  );

  useEffect(() => {
    if (!canTakeNow) return;
    if (appletId) {
      if (allParticipants.length === 0 && !isFetchingParticipants) {
        fetchParticipants({
          params: {
            ownerId,
            appletId,
            limit: 100,
          },
        });
      } else if (allParticipants.length > 0 && allTeamMembers.length === 0 && !isFetchingManagers) {
        fetchManagers({
          params: {
            ownerId,
            appletId,
            limit: 100,
          },
        });
      }

      if (userData && loggedInTeamMemberResponse === null && !isFetchingLoggedInTeamMember) {
        fetchLoggedInTeamMember({
          params: {
            ownerId,
            appletId,
            userId: userData.user.id,
            limit: 1,
          },
        });
      }
    }
  }, [
    appletId,
    ownerId,
    userData,
    allParticipants,
    allTeamMembers,
    loggedInTeamMemberResponse,
    isFetchingParticipants,
    isFetchingManagers,
    isFetchingLoggedInTeamMember,
    fetchParticipants,
    fetchManagers,
    fetchLoggedInTeamMember,
    canTakeNow,
  ]);

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

        // This conditional shouldn't be necessary, but TS is unable to propagate the type information from
        // (isSelfReporting || loggedInUser), so we have to check them again (or use the forbidden non-null assertion)
        if (isSelfReporting && sourceSubject.userId) {
          url.searchParams.set('respondentId', sourceSubject.userId);
        } else if (!isSelfReporting && loggedInUser && loggedInUser.userId) {
          url.searchParams.set('respondentId', loggedInUser.userId);
        }

        track('Multi-informant Start Activity click', {
          [MixpanelProps.SourceAccountType]: getAccountType(sourceSubject),
          [MixpanelProps.TargetAccountType]: getAccountType(targetSubject),
          [MixpanelProps.InputAccountType]: getAccountType(
            isSelfReporting ? sourceSubject : loggedInUser,
          ),
          [MixpanelProps.IsSelfReporting]: isSelfReporting || loggedInUser?.id === sourceSubject.id,
        });

        setActivityOrFlow(null);

        const newTab = window.open(url.toString(), '_blank');
        // message received from the TakeNowSuccessModal.tsx file from the web app
        // it's needed to close the new tab after the user clicks the "Close" button
        window.addEventListener('message', function messageHandler(event) {
          if (event.origin === url.origin) {
            const message = event.data;

            if (message === 'close-me') {
              newTab?.close();
            }

            this.removeEventListener('message', messageHandler);
          }
        });

        handleLogout({ shouldSoftLock: true });
      }
    }, [targetSubject, sourceSubject, isSelfReporting, loggedInUser, handleLogout]);

    /**
     * Handle participant search. It can be a combination of team members and any participants
     * (full account, pending, and limited), or just team members and full account participants
     */
    const handleSearch = useCallback(
      async (
        query: string,
        types:
          | [AnyTeamSearchType, ...AnyTeamSearchType[]]
          | [FullTeamSearchType, ...FullTeamSearchType[]],
      ): Promise<ParticipantDropdownOption[]> => {
        const requests = [];

        // @ts-expect-error Yes, the array can in fact contain this value
        const isAnyParticipant = types.includes('any-participant');

        // @ts-expect-error Yes, the array can in fact contain this value
        const isFullParticipant = types.includes('full-participant');

        if (types.includes('team')) {
          requests.push(
            getWorkspaceManagersApi({
              params: {
                ownerId,
                appletId,
                search: query,
                limit: DEFAULT_ROWS_PER_PAGE,
              },
            }),
          );
        }

        if (isAnyParticipant) {
          requests.push(
            getWorkspaceRespondentsApi({
              params: {
                ownerId,
                appletId,
                search: query,
                limit: DEFAULT_ROWS_PER_PAGE,
              },
            }),
          );
        } else if (isFullParticipant) {
          requests.push(
            getWorkspaceRespondentsApi({
              params: {
                ownerId,
                appletId,
                search: query,
                limit: DEFAULT_ROWS_PER_PAGE,
                shell: isFullParticipant ? false : undefined,
              },
            }),
          );
        }

        const [teamMemberResponse, participantsResponse] = await Promise.all(requests);

        // Filter the search results by allowed team members
        const allowedTeamMembersSearchResults =
          (teamMemberResponse?.data?.result as Manager[]).filter((manager) =>
            manager.roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)),
          ) ?? [];

        const participantsSearchResults =
          (participantsResponse?.data?.result as Respondent[]) ?? [];

        // If there are team members in the search results, we only want to show them if they are allowed
        return participantsSearchResults.map(participantToOption).filter((participant) => {
          if (participant.tag !== 'Team') {
            return isAnyParticipant || !!participant.userId;
          } else {
            return allowedTeamMembersSearchResults.some(
              (manager) => manager.id === participant.userId,
            );
          }
        });
      },
      [],
    );

    if (!activityOrFlow || !allParticipants || !participantsAndTeamMembers) {
      return null;
    }

    let thumbnail: ReactNode = null;
    if ('activities' in activityOrFlow) {
      thumbnail = <FlowSummaryThumbnail activities={activityOrFlow.activities} />;
    } else if (activityOrFlow.image) {
      thumbnail = <StyledImg src={activityOrFlow.image} alt={activityOrFlow.name} />;
    }

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
          (!isSelfReporting && loggedInUser === null)
        }
        data-testid={`${dataTestId}-take-now-modal`}
      >
        <StyledFlexColumn sx={{ gap: 3.2, padding: theme.spacing(1.6, 3.2, 2.4) }}>
          <StyledFlexTopCenter gap={2.4}>
            <StyledImageContainer>{thumbnail}</StyledImageContainer>
            <StyledHeadline sx={{ flexGrow: 1 }}>{activityOrFlow.name}</StyledHeadline>
          </StyledFlexTopCenter>
          <StyledFlexColumn gap={2.4}>
            <StyledFlexColumn gap={0.8}>
              <StyledFlexColumn gap={0.4}>
                <LabeledUserDropdown
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
                      (enableParticipantMultiInformant ? !!option.userId : option.tag === 'Team');

                    setIsSelfReporting(selfReportingCondition);
                  }}
                  data-testid={`${dataTestId}-take-now-modal-source-subject-dropdown`}
                  handleSearch={(query) => handleSearch(query, ['team', 'any-participant'])}
                  canShowWarningMessage={true}
                  showGroups={true}
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
                      : sourceSubject?.tag !== 'Team'
                  }
                  label={t('takeNow.modal.sourceSubjectCheckboxLabel')}
                />
              </StyledFlexColumn>
              {!isSelfReporting && (
                <LabeledUserDropdown
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
                  showGroups={true}
                />
              )}
            </StyledFlexColumn>
            <LabeledUserDropdown
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
          </StyledFlexColumn>
        </StyledFlexColumn>
      </Modal>
    );
  };

  const openTakeNowModal = (
    activityOrFlow: BaseActivity | HydratedActivityFlow,
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
