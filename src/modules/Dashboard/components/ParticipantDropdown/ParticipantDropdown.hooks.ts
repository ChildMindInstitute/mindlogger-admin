import { useCallback, useMemo } from 'react';

import { DEFAULT_ROWS_PER_PAGE, Roles, TEAM_MEMBER_ROLES } from 'shared/consts';
import { Participant, ParticipantStatus } from 'modules/Dashboard/types';
import { auth, workspaces } from 'redux/modules';
import { apiDashboardSlice, useGetWorkspaceRespondentsQuery } from 'modules/Dashboard/api/apiSlice';
import { WorkspaceRespondentsResponse } from 'api';
import { useAppDispatch } from 'redux/store';

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
  const dispatch = useAppDispatch();

  const isParticipantValid = useCallback(
    (r: Participant) =>
      !r.isAnonymousRespondent &&
      (includePendingAccounts || r.status !== ParticipantStatus.Pending),
    [includePendingAccounts],
  );

  const { data: participantsData, isLoading: isFetchingParticipants } =
    useGetWorkspaceRespondentsQuery({ params: { appletId, ownerId, limit: 100 } }, { skip });

  const allParticipants = useMemo(
    () => (participantsData?.result ?? []).filter(isParticipantValid).map(participantToOption),
    [isParticipantValid, participantsData?.result],
  );

  const { data: loggedInTeamMemberData, isLoading: isFetchingLoggedInTeamMember } =
    useGetWorkspaceRespondentsQuery(
      { params: { appletId, ownerId, userId: userData?.user.id, limit: 1 } },
      { skip },
    );
  const loggedInTeamMember = useMemo(
    () =>
      loggedInTeamMemberData?.result.length
        ? participantToOption(loggedInTeamMemberData.result[0])
        : null,
    [loggedInTeamMemberData],
  );

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
      // Use imperative RTK Query API to avoid unnecessary re-renders, which is problematic for
      // TakeNowModal in particular because of how it's recreated each time the useTakeNow hook
      // needs to re-run, resulting in a very jarring modal refresh with form state completely lost.
      // At some point TakeNowModal should be defined separately from useTakeNow to gracefully
      // accommodate possible re-renders.
      const response = await dispatch(
        apiDashboardSlice.endpoints.getWorkspaceRespondents.initiate({
          params: {
            ownerId,
            appletId,
            search: query,
            limit: DEFAULT_ROWS_PER_PAGE,
            shell: includedUserTypes.limitedParticipant,
          },
        }),
      );

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
    [dispatch, ownerId, appletId, isTeamMember, includePendingAccounts, isAllowedTeamMember],
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
