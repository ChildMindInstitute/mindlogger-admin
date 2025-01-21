import { useCallback, useMemo } from 'react';

import { DEFAULT_ROWS_PER_PAGE, Roles, TEAM_MEMBER_ROLES } from 'shared/consts';
import { Participant, ParticipantStatus } from 'modules/Dashboard/types';
import { auth, workspaces } from 'redux/modules';
import {
  useGetWorkspaceRespondentsQuery,
  useLazyGetWorkspaceRespondentsQuery,
} from 'modules/Dashboard/api/apiSlice';
import { WorkspaceRespondentsResponse } from 'api';

import {
  ParticipantDropdownOption,
  UseParticipantDropdownProps,
  SearchResultUserTypes,
} from './ParticipantDropdown.types';
import { participantToOption } from './ParticipantDropdown.utils';

const ALLOWED_TEAM_MEMBER_ROLES: readonly Roles[] = [
  Roles.SuperAdmin,
  Roles.Owner,
  Roles.Manager,
] as const;

export const useParticipantDropdown = ({
  appletId,
  includePendingAccounts = false,
  skip = false,
}: UseParticipantDropdownProps) => {
  const { ownerId } = workspaces.useData() || {};
  const userData = auth.useData();

  const isParticipantValid = useCallback(
    (r: Participant) =>
      !r.isAnonymousRespondent &&
      (includePendingAccounts || r.status !== ParticipantStatus.Pending),
    [includePendingAccounts],
  );

  const { data: participants, isLoading: isFetchingParticipants } = useGetWorkspaceRespondentsQuery(
    { params: { appletId, ownerId, limit: 100 } },
    {
      skip,
      selectFromResult: ({ data, ...rest }) => ({
        data: data?.result ?? [],
        ...rest,
      }),
    },
  );

  const allParticipants = useMemo(
    () => participants.filter(isParticipantValid).map(participantToOption),
    [isParticipantValid, participants],
  );

  const { data: loggedInTeamMember, isLoading: isFetchingLoggedInTeamMember } =
    useGetWorkspaceRespondentsQuery(
      { params: { appletId, ownerId, userId: userData?.user.id, limit: 1 } },
      {
        skip,
        selectFromResult: ({ data, ...rest }) => ({
          data: data?.result.length ? participantToOption(data.result[0]) : null,
          ...rest,
        }),
      },
    );

  // Lazy fetcher for search
  const [fetchParticipants] = useLazyGetWorkspaceRespondentsQuery();

  const isTeamMember = useCallback(
    (roles: Roles[]): boolean => roles.some((role) => TEAM_MEMBER_ROLES.includes(role)),
    [],
  );

  const isAllowedTeamMember = useCallback(
    (roles: Roles[]): boolean => roles.some((role) => ALLOWED_TEAM_MEMBER_ROLES.includes(role)),
    [],
  );

  const participantsOnly = useMemo(
    () => allParticipants.filter(({ isTeamMember }) => !isTeamMember),
    [allParticipants],
  );

  const teamMembersOnly = useMemo(
    () => allParticipants.filter((participant) => isAllowedTeamMember(participant.roles)),
    [allParticipants, isAllowedTeamMember],
  );

  const participantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...participantsOnly],
    [participantsOnly, teamMembersOnly],
  );

  const fullAccountParticipantsOnly = useMemo(
    () => participantsOnly.filter(({ userId }) => !!userId),
    [participantsOnly],
  );

  const fullAccountParticipantsAndTeamMembers = useMemo(
    () => [...teamMembersOnly, ...fullAccountParticipantsOnly],
    [fullAccountParticipantsOnly, teamMembersOnly],
  );

  /**
   * Handle participant search. It can be a combination of team members and any participants
   * (full and limited accounts), or just team members and full account participants
   */
  const handleSearch = useCallback(
    async (
      query: string,
      includedUserTypes: SearchResultUserTypes,
    ): Promise<ParticipantDropdownOption[]> => {
      const response = await fetchParticipants({
        params: {
          ownerId,
          appletId,
          search: query,
          limit: DEFAULT_ROWS_PER_PAGE,
          shell: includedUserTypes.limitedParticipant,
        },
      });

      const participantsSearchResults = (
        response?.data as WorkspaceRespondentsResponse
      ).result.filter((participant) => {
        if (participant.isAnonymousRespondent) return includedUserTypes.anonymousParticipant;

        if (participant.status === ParticipantStatus.Pending) {
          return includePendingAccounts && includedUserTypes.pendingInvitedParticipant;
        }

        const participantAppletDetails = participant.details[0];

        if (isTeamMember(participantAppletDetails.roles)) {
          return includedUserTypes.team && isAllowedTeamMember(participantAppletDetails.roles);
        }

        if (participantAppletDetails.roles.length === 0) {
          return includedUserTypes.limitedParticipant;
        }

        return includedUserTypes.fullParticipant;
      });

      return participantsSearchResults.map(participantToOption);
    },
    [
      fetchParticipants,
      ownerId,
      appletId,
      isTeamMember,
      includePendingAccounts,
      isAllowedTeamMember,
    ],
  );

  const isLoading = isFetchingParticipants || isFetchingLoggedInTeamMember;

  return {
    allParticipants,
    participantsOnly,
    teamMembersOnly,
    participantsAndTeamMembers,
    fullAccountParticipantsOnly,
    fullAccountParticipantsAndTeamMembers,
    loggedInTeamMember,
    handleSearch,
    isLoading,
  };
};
