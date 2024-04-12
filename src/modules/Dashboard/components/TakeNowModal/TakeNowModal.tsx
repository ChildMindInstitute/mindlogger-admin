import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal, SubmitBtnVariant } from 'shared/components';
import { auth, workspaces } from 'redux/modules';
import { StyledHeadline } from 'shared/styles';
import { useAsync } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { getWorkspaceRespondentsApi } from 'api';
import { joinWihComma } from 'shared/utils';
import { AutocompleteOption } from 'shared/components/FormComponents';

import { OpenTakeNowModalOptions, TakeNowModalProps } from './TakeNowModal.types';
import { StyledTakeNowModalContent, StyledTakeNowModalHeader } from './TakeNowModal.styles';
import { StyledImageContainer, StyledImg } from '../ActivitySummaryCard/ActivitySummaryCard.styles';
import { LabeledDropdown } from './LabeledDropdown/LabeledDropdown';
import { ParticipantsData } from '../../features/Participants';
import { BaseActivity } from '../ActivityGrid';

export const useTakeNowModal = () => {
  const { t } = useTranslation('app');
  const [activity, setActivity] = useState<BaseActivity | null>(null);
  const [participants, setParticipants] = useState<AutocompleteOption[]>([]);
  const [participantsAndTeamMembers, setParticipantsAndTeamMembers] = useState<
    AutocompleteOption[]
  >([]);
  const [defaultSubject, setDefaultSubject] = useState<AutocompleteOption | null>(null);
  const [defaultParticipant, setDefaultParticipant] = useState<AutocompleteOption | null>(null);
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();
  const { appletId } = useParams();

  const participantToOption = useCallback((participant: ParticipantsData['result'][0]) => {
    const stringNicknames = joinWihComma(participant.nicknames, true);
    const stringSecretIds = joinWihComma(participant.secretIds, true);
    const id = participant.id ?? participant.details[0].subjectId;
    let label = stringSecretIds;
    if (stringNicknames) {
      label = `${stringSecretIds} (${stringNicknames})`;
    }

    return { id, label };
  }, []);

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
      let whoIsResponding = `${userData.user.id}`;
      if (userData.user.firstName) {
        whoIsResponding += ` (${userData.user.firstName}`;
        if (userData.user.lastName) {
          whoIsResponding += ` ${userData.user.lastName[0].toUpperCase()}.`;
        }
        whoIsResponding += ')';
      }

      const ownerOption = { id: userData.user.id, label: whoIsResponding };

      // In the future we will allow choosing from the full list of participants and team members
      setParticipantsAndTeamMembers([ownerOption]);
    }
  }, [appletId, ownerId, getParticipants, userData]);

  const TakeNowModal = ({ onClose }: TakeNowModalProps) => {
    const handleClose = () => {
      setActivity(null);
      onClose?.();
    };

    const [subject, setSubject] = useState<AutocompleteOption | null>(defaultSubject);
    const [participant, setParticipant] = useState<AutocompleteOption | null>(
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
        submitBtnVariant={SubmitBtnVariant.Contained}
        footerStyles={{ padding: '0.8rem 3.2rem 3.2rem' }}
      >
        <StyledTakeNowModalContent>
          <StyledTakeNowModalHeader>
            <StyledImageContainer>
              {!!activity.image && <StyledImg src={activity.image} alt={activity.name} />}
            </StyledImageContainer>
            <StyledHeadline sx={{ flexGrow: 1 }}>{activity.name}</StyledHeadline>
          </StyledTakeNowModalHeader>
          <Box>
            <LabeledDropdown
              label={t('takeNowModalSubjectLabel')}
              name={'subject'}
              tooltip={t('takeNowModalSubjectTooltip')}
              placeholder={t('takeNowModalSubjectPlaceholder')}
              value={subject}
              options={participants}
              onChange={setSubject}
              handleSearch={async (search) => {
                const response = await getWorkspaceRespondentsApi({
                  params: {
                    ownerId,
                    appletId,
                    search,
                    limit: DEFAULT_ROWS_PER_PAGE,
                  },
                });

                return (response?.data as ParticipantsData)?.result.map(participantToOption) ?? [];
              }}
            />
            <LabeledDropdown
              label={t('takeNowModalParticipantLabel')}
              name={'participant'}
              tooltip={t('takeNowModalParticipantTooltip')}
              placeholder={t('takeNowModalParticipantPlaceholder')}
              value={participant}
              options={participantsAndTeamMembers}
              onChange={setParticipant}
              disabled
            />
          </Box>
        </StyledTakeNowModalContent>
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
