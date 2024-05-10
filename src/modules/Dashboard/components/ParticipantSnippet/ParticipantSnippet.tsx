import { BoxTypeMap } from '@mui/system';
import { ElementType } from 'react';

import { StyledFlexTopCenter, variables } from 'shared/styles';
import { ParticipantTagChip } from 'modules/Dashboard/components';

import { ParticipantSnippetProps } from './ParticipantSnippet.types';
import { StyledText } from './ParticipantSnippet.styles';

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
      <StyledText data-testid={`${dataTestId}-secretId`}>{secretId}</StyledText>
      {!!nickname && (
        <StyledText color={variables.palette.neutral60} data-testid={`${dataTestId}-nickname`}>
          {nickname}
        </StyledText>
      )}
      <ParticipantTagChip tag={tag} data-testid={`${dataTestId}-tag`} />
    </StyledFlexTopCenter>
  );
};
