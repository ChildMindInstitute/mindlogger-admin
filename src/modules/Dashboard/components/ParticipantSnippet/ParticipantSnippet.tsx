import { BoxTypeMap } from '@mui/system';
import { ElementType } from 'react';

import { StyledFlexTopCenter, variables } from 'shared/styles';
import { ParticipantTagChip } from 'modules/Dashboard/components';

import { ParticipantSnippetProps, ParticipantSnippetVariant } from './ParticipantSnippet.types';
import { StyledText, StyledTextLarge } from './ParticipantSnippet.styles';

export const ParticipantSnippet = <T extends ElementType = BoxTypeMap['defaultComponent']>({
  rightContent: children,
  secretId,
  nickname,
  tag,
  boxProps,
  variant = ParticipantSnippetVariant.Default,
  'data-testid': dataTestId,
}: ParticipantSnippetProps<T>) => {
  const { sx, ...rest } = boxProps ?? {};
  const isDefaultVariant = variant === ParticipantSnippetVariant.Default;
  const TextComponent = isDefaultVariant ? StyledText : StyledTextLarge;

  return (
    <StyledFlexTopCenter
      sx={{ gap: isDefaultVariant ? 0.8 : 1.6, ...sx }}
      {...rest}
      data-testid={dataTestId}
    >
      <TextComponent data-testid={`${dataTestId}-secretId`}>{secretId}</TextComponent>
      {!!nickname && (
        <TextComponent
          color={variables.palette[isDefaultVariant ? 'neutral60' : 'outline']}
          data-testid={`${dataTestId}-nickname`}
        >
          {nickname}
        </TextComponent>
      )}
      <ParticipantTagChip tag={tag} data-testid={`${dataTestId}-tag`} />
      {children}
    </StyledFlexTopCenter>
  );
};
