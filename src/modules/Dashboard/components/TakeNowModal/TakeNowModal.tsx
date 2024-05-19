import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormControlLabel } from '@mui/material';

import { Modal } from 'shared/components';
import { auth, users, workspaces } from 'redux/modules';
import { StyledFlexColumn, StyledFlexTopCenter, StyledHeadline, theme } from 'shared/styles';
import { DEFAULT_ROWS_PER_PAGE, MAX_LIMIT } from 'shared/consts';
import { getWorkspaceManagersApi, getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { useAppDispatch } from 'redux/store';
import { RenderIf } from 'shared/components';
import { useAsync } from 'shared/hooks';
import { ManagersData } from 'modules/Dashboard/features';

import {
  OpenTakeNowModalOptions,
  TakeNowModalProps,
  UseTakeNowModalProps,
} from './TakeNowModal.types';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledUserDropdown } from './LabeledDropdown/LabeledUserDropdown';
import { BaseActivity } from '../ActivityGrid';
import { ParticipantDropdownOption } from './LabeledDropdown/LabeledUserDropdown.types';

export const useTakeNowModal = ({ dataTestId }: UseTakeNowModalProps) => {
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const respondentsData = users.useAllRespondentsData();
  const respondentsStatus = users.useAllRespondentsStatus();

  const [managersData, setManagersData] = useState<ManagersData | null>(null);

  const { execute: getWorkspaceManagers } = useAsync(getWorkspaceManagersApi, (response) => {
    setManagersData(response?.data || null);
  });

  const participantToOption = useCallback(
    (participant: ParticipantsData['result'][0]): ParticipantDropdownOption => {
      const stringNicknames = joinWihComma(participant.nicknames, true);
      const stringSecretIds = joinWihComma(participant.secretIds, true);

      return {
        id: participant.details[0].subjectId,
        secretId: stringSecretIds,
        nickname: stringNicknames,
        tag: participant.details[0].subjectTag,
      };
    },
    [],
  );

  const sortByTeamTag = useCallback(
    (a: ParticipantDropdownOption, b: ParticipantDropdownOption): number => {
      if (a.tag === 'Team' && b.tag !== 'Team') {
        return -1;
      }
      if (a.tag !== 'Team' && b.tag === 'Team') {
        return 1;
      }

      return 0;
    },
    [],
  );

  const allowedRoles = useMemo(() => ['super_admin', 'owner', 'manager'], []);
  const allowedTeamMembers = useMemo(
    () =>
      (managersData?.result ?? []).filter((manager) =>
        manager.roles.some((role) => allowedRoles.includes(role)),
      ),
    [managersData, allowedRoles],
  );

  const filterTeamMembers = useCallback(
    (option: ParticipantDropdownOption): boolean => true,
    [allowedTeamMembers],
  );

  const [activity, setActivity] = useState<BaseActivity | null>(null);

  const optionsData = respondentsData?.result.map(participantToOption).sort(sortByTeamTag) ?? [];
  const [participants, setParticipants] = useState<ParticipantDropdownOption[]>(optionsData);
  const [participantsAndTeamMembers, setParticipantsAndTeamMembers] =
    useState<ParticipantDropdownOption[]>(optionsData);
  const [teamMembers, setTeamMembers] = useState<ParticipantDropdownOption[]>(
    optionsData.filter(filterTeamMembers),
  );

  const [defaultTargetSubject, setDefaultTargetSubject] =
    useState<ParticipantDropdownOption | null>(null);
  const [defaultSourceSubject, setDefaultSourceSubject] =
    useState<ParticipantDropdownOption | null>(null);

  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();

  useEffect(() => {
    if (appletId) {
      if (respondentsStatus === 'idle' || respondentsStatus === 'error') {
        const { getAllWorkspaceRespondents } = users.thunk;
        dispatch(
          getAllWorkspaceRespondents({
            params: { ownerId, appletId },
          }),
        );
      } else if (respondentsStatus === 'success' && respondentsData) {
        const options = respondentsData.result.map(participantToOption).sort(sortByTeamTag);
        setParticipants(options);
        setParticipantsAndTeamMembers(options);
        setTeamMembers(options.filter(filterTeamMembers));

        // Default to the current admin, if possible
        if (userData) {
          const ownerRespondent = respondentsData.result.find((r) => r.id === userData.user.id);
          if (ownerRespondent) {
            const ownerOption = options.find(
              (option) => option.id === ownerRespondent.details[0].subjectId,
            );
            if (ownerOption) {
              setDefaultSourceSubject(ownerOption);
            }
          }
        }
      }

      getWorkspaceManagers({
        params: {
          ownerId,
          limit: MAX_LIMIT,
          ...(appletId && { appletId }),
        },
      });
    }
  }, [
    appletId,
    dispatch,
    ownerId,
    userData,
    respondentsStatus,
    respondentsData,
    participantToOption,
  ]);

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
    const [loggedInUser, setLoggedInUser] = useState<ParticipantDropdownOption | null>(null);

    const handleSubmit = useCallback(() => {
      if (targetSubject && sourceSubject && (isSelfReporting || loggedInUser) && activity?.id) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activity.id);
        url.searchParams.set('sourceSubjectId', sourceSubject.id);
        url.searchParams.set('targetSubjectId', targetSubject.id);

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

    if (!activity || !participants || !participantsAndTeamMembers) {
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
                  tooltip=""
                  placeholder={t('takeNow.modal.sourceSubjectPlaceholder')}
                  value={sourceSubject}
                  options={participantsAndTeamMembers}
                  onChange={(option) => {
                    setSourceSubject(option);
                    if (option) {
                      setIsSelfReporting(true);
                    }
                  }}
                  data-testid={`${dataTestId}-take-now-modal-participant-dropdown`}
                />
                <FormControlLabel
                  control={<Checkbox sx={{ margin: 0, width: 48, height: 48 }} />}
                  sx={{ gap: 0.4 }}
                  checked={isSelfReporting}
                  onChange={(_e, checked) => setIsSelfReporting(checked)}
                  disabled={false}
                  label={t('takeNow.modal.sourceSubjectCheckboxLabel')}
                />
              </StyledFlexColumn>
              <RenderIf condition={!isSelfReporting}>
                <LabeledUserDropdown
                  label={t('takeNow.modal.loggedInUserLabel')}
                  name={'loggedInUser'}
                  tooltip=""
                  sx={{ gap: 1, pl: 5.2 }}
                  placeholder={t('takeNow.modal.loggedInUserPlaceholder')}
                  value={loggedInUser}
                  options={teamMembers}
                  onChange={setLoggedInUser}
                  data-testid={`${dataTestId}-take-now-modal-subject-dropdown`}
                  handleSearch={handleSearch}
                />
              </RenderIf>
            </StyledFlexColumn>
            <LabeledUserDropdown
              label={t('takeNow.modal.targetSubjectLabel')}
              name={'subject'}
              tooltip=""
              placeholder={t('takeNow.modal.targetSubjectPlaceholder')}
              value={targetSubject}
              options={participants}
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
