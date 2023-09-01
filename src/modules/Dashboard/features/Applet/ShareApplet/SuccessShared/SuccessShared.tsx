import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg, Chip } from 'shared/components';
import { variables } from 'shared/styles/variables';
import theme from 'shared/styles/theme';
import {
  StyledBodyMedium,
  StyledTitleBoldSmall,
  StyledFlexWrap,
  StyledTitleLarge,
} from 'shared/styles/styledComponents';

import { SuccessSharedProps } from './SuccessShared.types';
import {
  StyledSuccessShared,
  StyledApplet,
  StyledLinkBtn,
  StyledImg,
  StyledImgPlaceholder,
  StyledAppletContent,
  StyledText,
} from './SuccessShared.styles';

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
        {img ? <StyledImg src={img} alt="Applet image" /> : <StyledImgPlaceholder />}
        <StyledAppletContent>
          <StyledTitleLarge sx={{ flexBasis: '100%' }} color={variables.palette.on_surface_variant}>
            {title}
          </StyledTitleLarge>
          {text && <StyledText color={variables.palette.on_surface_variant}>{text}</StyledText>}
          {keywords?.length > 0 && (
            <StyledFlexWrap sx={{ marginTop: theme.spacing(0.8), flexBasis: '100%' }}>
              {keywords.map((word, i) => (
                <Chip color="secondary" key={i} title={word} />
              ))}
            </StyledFlexWrap>
          )}
          {activitiesQuantity ? (
            <StyledTitleBoldSmall
              sx={{ marginTop: theme.spacing(1.6) }}
            >{`${activitiesQuantity} ${t('activities')}`}</StyledTitleBoldSmall>
          ) : null}
        </StyledAppletContent>
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
