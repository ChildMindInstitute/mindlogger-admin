import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import { StyledFlexColumn, StyledFlexTopCenter, StyledHeadline, theme } from 'shared/styles';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { getWorkspaceManagersApi, getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { RenderIf } from 'shared/components';
import { useAsync } from 'shared/hooks';

import {
  OpenTakeNowModalOptions,
  TakeNowModalProps,
  UseTakeNowModalProps,
} from './TakeNowModal.types';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledUserDropdown } from './LabeledDropdown/LabeledUserDropdown';
import { BaseActivity } from '../ActivityGrid';
import { ParticipantDropdownOption } from './LabeledDropdown/LabeledUserDropdown.types';
import { Manager, Respondent } from '../../types';

const ALLOWED_TEAM_MEMBER_ROLES: readonly Roles[] = [
  Roles.SuperAdmin,
  Roles.Owner,
  Roles.Manager,
] as const;

export const useTakeNowModal = ({ dataTestId }: UseTakeNowModalProps) => {
  const { t } = useTranslation('app');
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();

  const [activity, setActivity] = useState<BaseActivity | null>(null);
  const [allParticipants, setAllParticipants] = useState<ParticipantDropdownOption[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<Manager[]>([]);
  const [defaultTargetSubject, setDefaultTargetSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [defaultSourceSubject, setDefaultSourceSubject] =
    useState<ParticipantDropdownOption | null>(null);

  const participantToOption = useMemo(
    () =>
      (participant: Respondent): ParticipantDropdownOption => {
        const stringNicknames = joinWihComma(participant.nicknames, true);
        const stringSecretIds = joinWihComma(participant.secretIds, true);

        return {
          id: participant.details[0].subjectId,
          userId: participant.id,
          secretId: stringSecretIds,
          nickname: stringNicknames,
          tag: participant.details[0].subjectTag,
        };
      },
    [],
  );

  const { execute: fetchParticipants } = useAsync(getWorkspaceRespondentsApi, (response) => {
    if (response?.data) {
      const options = (response.data as ParticipantsData).result.map(participantToOption);

      setAllParticipants(options);
    }
  });

  const { execute: fetchManagers } = useAsync(getWorkspaceManagersApi, (response) => {
    setAllTeamMembers(response?.data?.result || []);
  });

  const { execute: fetchLoggedInTeamMember } = useAsync(getWorkspaceRespondentsApi, (response) => {
    if (response?.data) {
      const loggedInTeamMember = participantToOption((response.data as ParticipantsData).result[0]);
      setDefaultSourceSubject(loggedInTeamMember);
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

  useEffect(() => {
    if (appletId) {
      if (allParticipants.length === 0) {
        fetchParticipants({
          params: {
            ownerId,
            appletId,
            limit: 100,
          },
        });
      }

      if (allParticipants.length > 0 && allTeamMembers.length === 0) {
        fetchManagers({
          params: {
            ownerId,
            appletId,
            limit: 100,
          },
        });
      }

      if (userData && defaultSourceSubject === null) {
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
  }, [appletId, ownerId, userData, allParticipants, allTeamMembers, defaultSourceSubject]);

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleClose = () => {
      setActivity(null);
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
      if (targetSubject && sourceSubject && (isSelfReporting || loggedInUser) && activity?.id) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activity.id);
        url.searchParams.set('sourceSubjectId', sourceSubject.id);
        url.searchParams.set('targetSubjectId', targetSubject.id);

        // This conditional shouldn't be necessary, but TS is unable to propagate the type information from
        // (isSelfReporting || loggedInUser), so we have to check them again (or use the forbidden non-null assertion)
        if (isSelfReporting && sourceSubject.userId) {
          url.searchParams.set('respondentId', sourceSubject.userId);
        } else if (!isSelfReporting && loggedInUser && loggedInUser.userId) {
          url.searchParams.set('respondentId', loggedInUser.userId);
        }

        // TODO: Remove once the web app is updated to process `targetSubjectId` instead of `subjectId`
        url.searchParams.set('subjectId', targetSubject.id);

        setActivity(null);
        window.open(url.toString(), '_blank');
      }
    }, [targetSubject, sourceSubject, loggedInUser, isSelfReporting]);

    const handleSearch = useCallback(
      async (search: string): Promise<ParticipantDropdownOption[]> => {
        const response = await getWorkspaceRespondentsApi({
          params: {
            ownerId,
            appletId,
            search,
            limit: DEFAULT_ROWS_PER_PAGE,
          },
        });

        return (response?.data as ParticipantsData)?.result.map(participantToOption) ?? [];
      },
      [],
    );

    if (!activity || !allParticipants || !participantsAndTeamMembers) {
      return null;
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
            <StyledImageContainer>
              {!!activity.image && <StyledImg src={activity.image} alt={activity.name} />}
            </StyledImageContainer>
            <StyledHeadline sx={{ flexGrow: 1 }}>{activity.name}</StyledHeadline>
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
                  onChange={(option) => {
                    setSourceSubject(option);
                    if (option) {
                      setIsSelfReporting(option.tag === 'Team');
                    }
                  }}
                  data-testid={`${dataTestId}-take-now-modal-participant-dropdown`}
                  canShowWarningMessage={true}
                  showGroups={true}
                />
                <FormControlLabel
                  control={<Checkbox sx={{ margin: 0, width: 48, height: 48 }} />}
                  sx={{ gap: 0.4 }}
                  checked={isSelfReporting}
                  onChange={(_e, checked) => setIsSelfReporting(checked)}
                  disabled={true}
                  label={t('takeNow.modal.sourceSubjectCheckboxLabel')}
                />
              </StyledFlexColumn>
              <RenderIf condition={!isSelfReporting}>
                <LabeledUserDropdown
                  label={t('takeNow.modal.loggedInUserLabel')}
                  name={'loggedInUser'}
                  sx={{ gap: 1, pl: 5.2 }}
                  placeholder={t('takeNow.modal.loggedInUserPlaceholder')}
                  value={loggedInUser}
                  options={teamMembersOnly}
                  onChange={setLoggedInUser}
                  data-testid={`${dataTestId}-take-now-modal-subject-dropdown`}
                  handleSearch={handleSearch}
                  showGroups={true}
                />
              </RenderIf>
            </StyledFlexColumn>
            <LabeledUserDropdown
              label={t('takeNow.modal.targetSubjectLabel')}
              name={'subject'}
              placeholder={t('takeNow.modal.targetSubjectPlaceholder')}
              value={targetSubject}
              options={participantsAndTeamMembers}
              onChange={setTargetSubject}
              data-testid={`${dataTestId}-take-now-modal-subject-dropdown`}
              handleSearch={handleSearch}
            />
          </StyledFlexColumn>
        </StyledFlexColumn>
      </Modal>
    );
  };

  const openTakeNowModal = (activity: BaseActivity, options?: OpenTakeNowModalOptions) => {
    setActivity(activity);

    if (options?.targetSubject) {
      setDefaultTargetSubject(options.targetSubject);
    }

    if (options?.sourceSubject) {
      setDefaultSourceSubject(options.sourceSubject);
    }
  };

  return { TakeNowModal, openTakeNowModal };
};
