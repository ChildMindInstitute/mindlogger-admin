import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { Icon } from 'components/Icon';
import { variables } from 'styles/variables';
import { StyledMediumTitle } from 'styles/styledComponents/Typography';
import { breadcrumbs } from 'redux/modules';

import { StyledAvatarWrapper, StyledAvatar, StyledLink, StyledBox } from './Breadcrumbs.styles';

export const Breadcrumbs = (): JSX.Element => {
  const breadcrumbsData = breadcrumbs.useData();
  const getBreadcrumbAvatar = (index: number) => {
    if (index === 0) {
      return <Icon.Workspace width="3.2rem" height="3.2rem" />;
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
              <StyledMediumTitle fontWeight="semiBold" letterSpacing="xl">
                {crumb.label}
              </StyledMediumTitle>
            </StyledBox>
          ) : (
            <StyledLink key={index} to={crumb.navPath}>
              <StyledAvatarWrapper>{getBreadcrumbAvatar(index)}</StyledAvatarWrapper>
              <StyledMediumTitle fontWeight="regular" color={variables.palette.shades80}>
                {crumb.label}
              </StyledMediumTitle>
            </StyledLink>
          );
        })}
    </MuiBreadcrumbs>
  );
};
