import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { Svg } from 'components/Svg';
import { breadcrumbs } from 'redux/modules';
import { StyledLabelSmall, StyledTitleSmall } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import {
  StyledLink,
  StyledBox,
  StyledIconWrapper,
  StyledIconImg,
  StyledPlaceholder,
} from './Breadcrumbs.styles';

export const Breadcrumbs = (): JSX.Element => {
  const breadcrumbsData = breadcrumbs.useData();

  const getBreadcrumbIcon = (icon: string | JSX.Element, label: string) => {
    if (typeof icon === 'string') {
      icon
        ? (icon = <StyledIconImg src={icon} alt="Icon" />)
        : (icon = (
            <StyledPlaceholder>
              <StyledLabelSmall color={variables.palette.on_surface}>
                {label.substring(0, 1).toUpperCase()}
              </StyledLabelSmall>
            </StyledPlaceholder>
          ));
    }

    return <StyledIconWrapper>{icon}</StyledIconWrapper>;
  };

  return (
    <MuiBreadcrumbs separator={<Svg id="separator" width="8" height="12" />}>
      {breadcrumbsData &&
        breadcrumbsData.length > 0 &&
        breadcrumbsData.map((crumb, index) => {
          const last = index === breadcrumbsData.length - 1;

          return last ? (
            <StyledBox key={index}>
              {getBreadcrumbIcon(crumb.icon, crumb.label)}
              <StyledTitleSmall fontWeight="semiBold" letterSpacing="xl">
                {crumb.label}
              </StyledTitleSmall>
            </StyledBox>
          ) : (
            <StyledLink key={index} to={crumb.navPath ? crumb.navPath : ''}>
              {getBreadcrumbIcon(crumb.icon, crumb.label)}
              <StyledTitleSmall fontWeight="regular" color={variables.palette.on_surface_variant}>
                {crumb.label}
              </StyledTitleSmall>
            </StyledLink>
          );
        })}
    </MuiBreadcrumbs>
  );
};
