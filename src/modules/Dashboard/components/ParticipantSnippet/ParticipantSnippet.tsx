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
  'data-testid': dataTestId,
}: ParticipantSnippetProps<T>) => {
  const { sx, ...rest } = boxProps ?? {};

  return (
    <StyledFlexTopCenter sx={{ gap: 0.8, ...sx }} {...rest} data-testid={dataTestId}>
      <StyledBodyLarger data-testid={`${dataTestId}-secretId`}>{secretId}</StyledBodyLarger>
      {!!nickname && (
        <StyledBodyLarger
          color={variables.palette.neutral60}
          data-testid={`${dataTestId}-nickname`}
        >
          {nickname}
        </StyledBodyLarger>
      )}
      {/*
      TODO: add respondent tag/label (with appropriate Chip/Tag component) when available
      https://mindlogger.atlassian.net/browse/M2-5861
      https://mindlogger.atlassian.net/browse/M2-6161
      */}
      {!!tag && (
        <Chip
          color="secondary"
          title={tag}
          sxProps={{ pointerEvents: 'none', m: 0 }}
          data-testid={`${dataTestId}-tag`}
        />
      )}
    </StyledFlexTopCenter>
  );
};
