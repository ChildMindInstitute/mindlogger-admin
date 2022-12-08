import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { Svg } from 'components/Svg';
import { breadcrumbs } from 'redux/modules';
import {
  StyledLabelSmall,
  StyledLabelMedium,
  StyledBodySmall,
} from 'styles/styledComponents/Typography';
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
    let resultIcon = icon;
    if (typeof icon === 'string') {
      icon
        ? (resultIcon = <StyledIconImg src={icon} alt="Icon" />)
        : (resultIcon = (
            <StyledPlaceholder>
              <StyledLabelSmall color={variables.palette.on_surface}>
                {label.substring(0, 1).toUpperCase()}
              </StyledLabelSmall>
            </StyledPlaceholder>
          ));
    }

    return <StyledIconWrapper>{resultIcon}</StyledIconWrapper>;
  };

  return (
    <MuiBreadcrumbs separator={<Svg id="separator" width="8" height="12" />}>
      {breadcrumbsData &&
        breadcrumbsData.length > 0 &&
        breadcrumbsData.map(({ icon, label, navPath, disabledLink }, index) => {
          const last = index === breadcrumbsData.length - 1;

          return last || disabledLink ? (
            <StyledBox key={index}>
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
            <StyledLink key={index} to={navPath || ''}>
              {getBreadcrumbIcon(icon, label)}
              <StyledBodySmall color={variables.palette.on_surface_variant}>
                {label}
              </StyledBodySmall>
            </StyledLink>
          );
        })}
    </MuiBreadcrumbs>
  );
};
