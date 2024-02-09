import { useState } from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Svg, Chip, AppletImage } from 'shared/components';
import {
  StyledBodyMedium,
  StyledTitleBoldSmall,
  StyledFlexWrap,
  StyledTitleLarge,
} from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';
import { variables } from 'shared/styles/variables';

import { appletImageProps } from './SuccessShared.const';
import { StyledSuccessShared, StyledApplet, StyledLinkBtn, StyledText } from './SuccessShared.styles';
import { SuccessSharedProps } from './SuccessShared.types';

export const SuccessShared = ({
  title,
  text,
  keywords,
  activitiesQuantity,
  appletLink,
  img,
  'data-testid': dataTestid,
}: SuccessSharedProps) => {
  const { t } = useTranslation('app');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyAppletLink = async () => {
    await navigator.clipboard.writeText(appletLink);
    setLinkCopied(true);
  };

  return (
    <StyledSuccessShared>
      <StyledApplet>
        <AppletImage image={img} appletName={title} {...appletImageProps} />
        <Box>
          <StyledTitleLarge sx={{ wordBreak: 'break-word' }} color={variables.palette.on_surface_variant}>
            {title}
          </StyledTitleLarge>
          {text && (
            <StyledText sx={{ wordBreak: 'break-word' }} color={variables.palette.on_surface_variant}>
              {text}
            </StyledText>
          )}
          {keywords?.length > 0 && (
            <StyledFlexWrap sx={{ width: '100%', marginTop: theme.spacing(0.8) }}>
              {keywords.map((word, i) => (
                <Chip color="secondary" key={i} title={word} />
              ))}
            </StyledFlexWrap>
          )}
          {activitiesQuantity ? (
            <StyledTitleBoldSmall sx={{ marginTop: theme.spacing(1.6) }}>{`${activitiesQuantity} ${t(
              'activities',
            )}`}</StyledTitleBoldSmall>
          ) : null}
        </Box>
      </StyledApplet>
      <StyledLinkBtn
        startIcon={<Svg width="18" height="18" id="duplicate" />}
        variant="text"
        onClick={handleCopyAppletLink}
        data-testid={`${dataTestid}-copy-link`}
      >
        {t('copyAppletLink')}
      </StyledLinkBtn>
      {linkCopied && (
        <StyledBodyMedium sx={{ margin: theme.spacing(0.25, 0, 0, 1.5) }}>
          {t('linkSuccessfullyCopied')}
        </StyledBodyMedium>
      )}
    </StyledSuccessShared>
  );
};
