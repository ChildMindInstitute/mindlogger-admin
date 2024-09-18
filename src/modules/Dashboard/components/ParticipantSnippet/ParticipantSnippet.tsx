import { BoxTypeMap } from '@mui/system';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import { StyledFlexAllCenter, StyledFlexTopCenter, variables } from 'shared/styles';
import { ParticipantTagChip } from 'modules/Dashboard/components';
import { Svg, Tooltip } from 'shared/components';

import { ParticipantSnippetProps, ParticipantSnippetVariant } from './ParticipantSnippet.types';
import { StyledText, StyledTextLarge } from './ParticipantSnippet.styles';

export const ParticipantSnippet = <T extends ElementType = BoxTypeMap['defaultComponent']>({
  rightContent: children,
  secretId,
  nickname,
  tag,
  isTeamMember = tag === 'Team',
  boxProps,
  variant = ParticipantSnippetVariant.Default,
  hasLimitedAccountIcon,
  'data-testid': dataTestId = 'participant-snippet',
}: ParticipantSnippetProps<T>) => {
  const { t } = useTranslation('app');
  const { sx, ...rest } = boxProps ?? {};
  const isDefaultVariant = variant === ParticipantSnippetVariant.Default;
  const TextComponent = isDefaultVariant ? StyledText : StyledTextLarge;

  const components = isTeamMember
    ? [{ name: 'nickname', value: nickname }]
    : [
        { name: 'secretId', value: secretId },
        { name: 'nickname', value: nickname },
      ];

  return (
    <StyledFlexTopCenter
      sx={{ gap: isDefaultVariant ? 0.8 : 1.6, ...sx }}
      {...rest}
      data-testid={dataTestId}
    >
      <TextComponent data-testid={`${dataTestId}-${components[0].name}`} sx={{ maxWidth: '50%' }}>
        {components[0].value}
      </TextComponent>
      {!!components[1] && (
        <TextComponent
          color={variables.palette[isDefaultVariant ? 'neutral60' : 'outline']}
          data-testid={`${dataTestId}-${components[1].name}`}
        >
          {components[1].value}
        </TextComponent>
      )}
      <ParticipantTagChip tag={tag} data-testid={`${dataTestId}-tag`} />
      {hasLimitedAccountIcon && (
        <Tooltip tooltipTitle={t('participantDropdown.limitedAccountIconTooltip')}>
          <StyledFlexAllCenter sx={{ ml: 'auto', pointerEvents: 'auto' }}>
            <Svg id="coordinator" width={24} height={24} />
          </StyledFlexAllCenter>
        </Tooltip>
      )}

      {children}
    </StyledFlexTopCenter>
  );
};
