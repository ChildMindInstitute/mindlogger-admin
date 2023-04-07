import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'shared/components/Svg';
import { breadcrumbs } from 'redux/modules';
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
} from './Breadcrumbs.styles';
import { BREADCRUMB_ICON_SIZE } from './Breadcrumbs.const';

export const Breadcrumbs = () => {
  const breadcrumbsData = breadcrumbs.useData();

  const getBreadcrumbIcon = (icon: string, label: string, hasUrl = false) => {
    const iconComponent = hasUrl ? (
      <StyledIconImg src={icon} alt="Icon" />
    ) : (
      <Svg id={icon} width={BREADCRUMB_ICON_SIZE} height={BREADCRUMB_ICON_SIZE} />
    );

    return (
      <StyledIconWrapper>
        {icon ? (
          iconComponent
        ) : (
          <StyledPlaceholder>
            <StyledLabelSmall color={variables.palette.on_surface}>
              {label.substring(0, 1).toUpperCase()}
            </StyledLabelSmall>
          </StyledPlaceholder>
        )}
      </StyledIconWrapper>
    );
  };

  return (
    <MuiBreadcrumbs separator={<Svg id="separator" width="8" height="12" />}>
      {breadcrumbsData?.map(({ icon, label, navPath, disabledLink, hasUrl }, index) =>
        index === breadcrumbsData.length - 1 || disabledLink ? (
          <StyledBox key={uniqueId()}>
            {getBreadcrumbIcon(icon, label, hasUrl)}
            {disabledLink ? (
              <StyledBodySmall color={variables.palette.on_surface_variant}>
                {label}
              </StyledBodySmall>
            ) : (
              <StyledLabelMedium color={variables.palette.on_surface}>{label}</StyledLabelMedium>
            )}
          </StyledBox>
        ) : (
          <StyledLink key={uniqueId()} to={navPath || ''}>
            {getBreadcrumbIcon(icon, label, hasUrl)}
            <StyledBodySmall color={variables.palette.on_surface_variant}>{label}</StyledBodySmall>
          </StyledLink>
        ),
      )}
    </MuiBreadcrumbs>
  );
};
