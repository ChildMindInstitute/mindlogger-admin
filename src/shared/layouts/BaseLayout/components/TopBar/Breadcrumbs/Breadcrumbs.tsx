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

import { StyledLink, StyledBox, StyledIconWrapper, StyledPlaceholder } from './Breadcrumbs.styles';
import { BREADCRUMB_ICON_SIZE } from './Breadcrumbs.const';

export const Breadcrumbs = () => {
  const breadcrumbsData = breadcrumbs.useData();

  const getBreadcrumbIcon = (icon: string, label: string) => (
    <StyledIconWrapper>
      {icon ? (
        <Svg id={icon} width={BREADCRUMB_ICON_SIZE} height={BREADCRUMB_ICON_SIZE} />
      ) : (
        <StyledPlaceholder>
          <StyledLabelSmall color={variables.palette.on_surface}>
            {label.substring(0, 1).toUpperCase()}
          </StyledLabelSmall>
        </StyledPlaceholder>
      )}
    </StyledIconWrapper>
  );

  return (
    <MuiBreadcrumbs separator={<Svg id="separator" width="8" height="12" />}>
      {breadcrumbsData?.map(({ icon, label, navPath, disabledLink }, index) =>
        index === breadcrumbsData.length - 1 || disabledLink ? (
          <StyledBox key={uniqueId()}>
            {getBreadcrumbIcon(icon, label)}
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
            {getBreadcrumbIcon(icon, label)}
            <StyledBodySmall color={variables.palette.on_surface_variant}>{label}</StyledBodySmall>
          </StyledLink>
        ),
      )}
    </MuiBreadcrumbs>
  );
};
