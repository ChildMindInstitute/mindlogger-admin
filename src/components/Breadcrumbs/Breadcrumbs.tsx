import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { Svg } from 'components/Svg';
import { variables } from 'styles/variables';
import { StyledTitleSmall } from 'styles/styledComponents/Typography';
import { breadcrumbs } from 'redux/modules';

import { StyledAvatarWrapper, StyledAvatar, StyledLink, StyledBox } from './Breadcrumbs.styles';

export const Breadcrumbs = (): JSX.Element => {
  const breadcrumbsData = breadcrumbs.useData();
  const getBreadcrumbAvatar = (index: number) => {
    if (index === 0) {
      return <Svg id="workspace" width="3.2rem" height="3.2rem" />;
    }

    return <StyledAvatar />;
  };

  return (
    <MuiBreadcrumbs>
      {breadcrumbsData &&
        breadcrumbsData.length > 0 &&
        breadcrumbsData.map((crumb, index) => {
          const last = index === breadcrumbsData.length - 1;

          return last ? (
            <StyledBox key={index}>
              <StyledAvatarWrapper>{getBreadcrumbAvatar(index)}</StyledAvatarWrapper>
              <StyledTitleSmall fontWeight="semiBold" letterSpacing="xl">
                {crumb.label}
              </StyledTitleSmall>
            </StyledBox>
          ) : (
            <StyledLink key={index} to={crumb.navPath}>
              <StyledAvatarWrapper>{getBreadcrumbAvatar(index)}</StyledAvatarWrapper>
              <StyledTitleSmall fontWeight="regular" color={variables.palette.on_surface_variant}>
                {crumb.label}
              </StyledTitleSmall>
            </StyledLink>
          );
        })}
    </MuiBreadcrumbs>
  );
};
