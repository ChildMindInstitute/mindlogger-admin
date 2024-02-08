import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledLabelSmall, StyledLabelMedium, StyledBodySmall } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { BREADCRUMB_ICON_SIZE } from './Breadcrumbs.const';
import { useBreadcrumbs } from './Breadcrumbs.hooks';
import {
  StyledLink,
  StyledBox,
  StyledIconWrapper,
  StyledPlaceholder,
  StyledIconImg,
  StyledChip,
} from './Breadcrumbs.styles';
import { Breadcrumb } from './Breadcrumbs.types';

export const Breadcrumbs = () => {
  const breadcrumbsData = useBreadcrumbs();

  const getIconComponent = (icon: string, hasUrl?: boolean) =>
    hasUrl ? (
      <StyledIconImg src={icon} alt="Icon" data-testid="breadcrumbs-item-src" />
    ) : (
      <Svg id={icon} width={BREADCRUMB_ICON_SIZE} height={BREADCRUMB_ICON_SIZE} data-testid="breadcrumbs-item-icon" />
    );

  const getBreadcrumbIcon = ({ icon, useCustomIcon, label, hasUrl }: Breadcrumb) => {
    if (!icon && !useCustomIcon) return null;

    return (
      <StyledIconWrapper>
        {icon ? (
          getIconComponent(icon, hasUrl)
        ) : (
          <StyledPlaceholder data-testid="breadcrumbs-item-placeholder">
            <StyledLabelSmall color={variables.palette.on_surface}>
              {label.substring(0, 1).toUpperCase()}
            </StyledLabelSmall>
          </StyledPlaceholder>
        )}
      </StyledIconWrapper>
    );
  };

  return (
    <MuiBreadcrumbs separator={<Svg id="separator" width="8" height="12" />} data-testid="breadcrumbs">
      {breadcrumbsData?.map(({ icon, useCustomIcon, label, chip, navPath, disabledLink, hasUrl, key }, index) =>
        index === breadcrumbsData.length - 1 || disabledLink ? (
          <StyledBox key={key} data-testid="breadcrumbs-item">
            {getBreadcrumbIcon({ icon, useCustomIcon, label, hasUrl })}
            {disabledLink ? (
              <StyledBodySmall color={variables.palette.on_surface_variant}>{label}</StyledBodySmall>
            ) : (
              <StyledLabelMedium color={variables.palette.on_surface}>{label}</StyledLabelMedium>
            )}
          </StyledBox>
        ) : (
          <StyledLink key={key} to={navPath || ''} data-testid="breadcrumbs-link">
            {getBreadcrumbIcon({ icon, useCustomIcon, label, hasUrl })}
            <StyledBodySmall color={variables.palette.on_surface_variant}>{label}</StyledBodySmall>
            {chip && (
              <StyledChip>
                <StyledBodySmall color={variables.palette.on_surface_variant}>{chip}</StyledBodySmall>
              </StyledChip>
            )}
          </StyledLink>
        ),
      )}
    </MuiBreadcrumbs>
  );
};
