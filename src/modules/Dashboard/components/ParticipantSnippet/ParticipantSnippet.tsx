import { ElementType } from 'react';
import { BoxTypeMap } from '@mui/system';

import { Chip } from 'shared/components';
import { StyledBodyLarger, StyledFlexTopCenter, variables } from 'shared/styles';

import { ParticipantSnippetProps } from './ParticipantSnippet.types';

export const ParticipantSnippet = <T extends ElementType = BoxTypeMap['defaultComponent']>({
  secretId,
  nickname,
  tag,
  boxProps,
}: ParticipantSnippetProps<T>) => {
  const { sx, ...rest } = boxProps ?? {};

  return (
    <StyledFlexTopCenter sx={{ gap: 0.8, ...sx }} {...rest}>
      <StyledBodyLarger>{secretId}</StyledBodyLarger>
      {!!nickname && (
        <StyledBodyLarger color={variables.palette.neutral60}>{nickname}</StyledBodyLarger>
      )}
      {/*
    TODO: add respondent tag/label (with appropriate Chip/Tag component) when available
    https://mindlogger.atlassian.net/browse/M2-5861
    https://mindlogger.atlassian.net/browse/M2-6161
    */}
      {!!tag && <Chip color="secondary" title={tag} sxProps={{ pointerEvents: 'none', m: 0 }} />}
    </StyledFlexTopCenter>
  );
};
