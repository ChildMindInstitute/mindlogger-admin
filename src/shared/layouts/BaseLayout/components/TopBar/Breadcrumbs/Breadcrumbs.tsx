import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import { Icons } from 'svgSprite';

import { Svg } from 'shared/components/Svg';
import {
  StyledLabelSmall,
  StyledLabelMedium,
  StyledBodySmall,
} from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import {
  StyledLink,
  StyledBox,
  StyledIconWrapper,
  StyledPlaceholder,
  StyledIconImg,
  StyledChip,
} from './Breadcrumbs.styles';
import { BREADCRUMB_ICON_SIZE } from './Breadcrumbs.const';
import { useBreadcrumbs } from './Breadcrumbs.hooks';
import { Breadcrumb } from './Breadcrumbs.types';

export const Breadcrumbs = () => {
  const breadcrumbsData = useBreadcrumbs();

  const getIconComponent = (icon?: Icons, image?: string) => {
    if (image) {
      return <StyledIconImg src={image} alt="Icon" data-testid="breadcrumbs-item-src" />;
    }

    if (icon) {
      return (
        <Svg
          id={icon}
          width={BREADCRUMB_ICON_SIZE}
          height={BREADCRUMB_ICON_SIZE}
          data-testid="breadcrumbs-item-icon"
        />
      );
    }
  };

  const getBreadcrumbIcon = ({ icon, label, useCustomIcon, image }: Breadcrumb) => {
    if (!icon && !image && !useCustomIcon) return null;

    return (
      <StyledIconWrapper>
        {icon || image ? (
          getIconComponent(icon, image)
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
    <MuiBreadcrumbs
      separator={<Svg id="separator" width="8" height="12" />}
      data-testid="breadcrumbs"
    >
      {breadcrumbsData?.map(
        ({ icon, useCustomIcon, label, chip, navPath, disabledLink, image, key }, index) =>
          index === breadcrumbsData.length - 1 || disabledLink ? (
            <StyledBox key={key} data-testid="breadcrumbs-item">
              {getBreadcrumbIcon({ icon, useCustomIcon, label, image })}
              {disabledLink ? (
                <StyledBodySmall color={variables.palette.on_surface_variant}>
                  {label}
                </StyledBodySmall>
              ) : (
                <StyledLabelMedium color={variables.palette.on_surface}>{label}</StyledLabelMedium>
              )}
            </StyledBox>
          ) : (
            <StyledLink key={key} to={navPath || ''} data-testid="breadcrumbs-link">
              {getBreadcrumbIcon({ icon, useCustomIcon, label, image })}
              <StyledBodySmall color={variables.palette.on_surface_variant}>
                {label}
              </StyledBodySmall>
              {chip && (
                <StyledChip>
                  <StyledBodySmall color={variables.palette.on_surface_variant}>
                    {chip}
                  </StyledBodySmall>
                </StyledChip>
              )}
            </StyledLink>
          ),
      )}
    </MuiBreadcrumbs>
  );
};
