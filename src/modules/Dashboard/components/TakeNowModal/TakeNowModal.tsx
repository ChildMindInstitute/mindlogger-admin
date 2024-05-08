import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledHeadline,
  StyledModalWrapper,
} from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';

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
  const [activity, setActivity] = useState<BaseActivity | null>(null);
  const [participants, setParticipants] = useState<ParticipantDropdownOption[]>([]);
  const [participantsAndTeamMembers, setParticipantsAndTeamMembers] = useState<
    ParticipantDropdownOption[]
  >([]);
  const [defaultSubject, setDefaultSubject] = useState<ParticipantDropdownOption | null>(null);
  const [defaultParticipant, setDefaultParticipant] = useState<ParticipantDropdownOption | null>(
    null,
  );
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();

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

  const { execute: getParticipants } = useAsync(getWorkspaceRespondentsApi, (response) => {
    if (response?.data) {
      const data = (response.data as ParticipantsData).result;
      setParticipants(data.map(participantToOption));
    }
  });

  useEffect(() => {
    if (appletId) {
      getParticipants({
        params: {
          ownerId,
          appletId,
          limit: DEFAULT_ROWS_PER_PAGE,
        },
      });
    }

    if (userData) {
      // For now, the admin is the only member of this list
      let ownerNickname = '';
      if (userData.user.firstName) {
        ownerNickname += `${userData.user.firstName}`;
        if (userData.user.lastName) {
          ownerNickname += ` ${userData.user.lastName}`;
        }
      }

      const ownerOption: ParticipantDropdownOption = {
        // Here we use the user ID instead of the subject ID
        id: userData.user.id,
        secretId: userData.user.id,
        nickname: ownerNickname,
      };

      // In the future we will allow choosing from the full list of participants and team members
      setParticipantsAndTeamMembers([ownerOption]);
    }
  }, [appletId, ownerId, getParticipants, userData]);

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleClose = () => {
      setActivity(null);
      onClose?.();
    };

    const [subject, setSubject] = useState<ParticipantDropdownOption | null>(defaultSubject);
    const [participant, setParticipant] = useState<ParticipantDropdownOption | null>(
      defaultParticipant || participantsAndTeamMembers[0],
    );
    const handleSubmit = useCallback(() => {
      if (subject && participant && activity?.id) {
        const url = new URL(`protected/applets/${appletId}`, `${process.env.REACT_APP_WEB_URI}/`);
        url.searchParams.set('startActivityOrFlow', activity.id);
        url.searchParams.set('subjectId', subject.id);
        url.searchParams.set('respondentId', participant.id);

        setActivity(null);
        window.open(url.toString(), '_blank');
      }
    }, [subject, participant]);

    if (!activity || !participants || !participantsAndTeamMembers) {
      return null;
    }

    return (
      <Modal
        open={true}
        width="57"
        title={t('takeNow')}
        buttonText={t('startActivity')}
        onSubmit={handleSubmit}
        onClose={handleClose}
        disabledSubmit={subject === null || participant === null}
        data-testid={`${dataTestId}-take-now-modal`}
      >
        <StyledModalWrapper>
          <StyledFlexColumn sx={{ gap: 0.8 }}>
            <StyledFlexTopCenter sx={{ gap: 2.4 }}>
              <StyledImageContainer>
                {!!activity.image && <StyledImg src={activity.image} alt={activity.name} />}
              </StyledImageContainer>
              <StyledHeadline sx={{ flexGrow: 1 }}>{activity.name}</StyledHeadline>
            </StyledFlexTopCenter>
            <Box>
              <LabeledUserDropdown
                  label={t('takeNowModalParticipantLabel')}
                  name={'participant'}
                  placeholder={t('takeNowModalParticipantPlaceholder')}
                  value={participant}
                  options={participantsAndTeamMembers}
                  onChange={setParticipant}
                  data-testid={`${dataTestId}-take-now-modal-participant-dropdown`}
                  disabled
              />
              <LabeledUserDropdown
                label={t('takeNowModalSubjectLabel')}
                name={'subject'}
                placeholder={t('takeNowModalSubjectPlaceholder')}
                value={subject}
                options={participants}
                onChange={setSubject}
                data-testid={`${dataTestId}-take-now-modal-subject-dropdown`}
                handleSearch={async (search) => {
                  const response = await getWorkspaceRespondentsApi({
                    params: {
                      ownerId,
                      appletId,
                      search,
                      limit: DEFAULT_ROWS_PER_PAGE,
                    },
                  });

                  return (
                    (response?.data as ParticipantsData)?.result.map(participantToOption) ?? []
                  );
                }}
              />
            </Box>
          </StyledFlexColumn>
        </StyledModalWrapper>
      </Modal>
    );
  };

  const openTakeNowModal = (activity: BaseActivity, options?: OpenTakeNowModalOptions) => {
    setActivity(activity);
    setDefaultSubject(options?.subject || null);
    setDefaultParticipant(options?.participant || null);
  };

  return { TakeNowModal, openTakeNowModal };
};
