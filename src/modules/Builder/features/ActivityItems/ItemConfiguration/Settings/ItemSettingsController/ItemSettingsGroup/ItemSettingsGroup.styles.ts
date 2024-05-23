import { styled, Box, FormControl, Collapse, FormLabel } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { StyledFlexTopCenter, theme, variables } from 'shared/styles';
import { shouldForwardProp } from 'shared/utils';

export const StyledSettingTitleContainer = styled(Box, shouldForwardProp)`
  ${({ withInput }: { withInput?: boolean }) =>
    withInput &&
    `
      display: flex;
      align-items:center;
  `}
`;

export const StyledInputControllerContainer = styled(Box)`
  width: 8rem;
  margin-right: ${theme.spacing(0.5)};

  .MuiBox-root {
    margin: 0;
  }

  .MuiButton-root {
    height: 1.2rem;
  }

  .MuiInputBase-root {
    padding: ${theme.spacing(0, 1)};
    border-radius: ${variables.borderRadius.lg};
    border-color: ${variables.palette.on_surface};
  }

  .MuiInputBase-input {
    padding: ${theme.spacing(0.7, 0)};
  }
`;

export const StyledSettingInfoIcon = styled(Svg)`
  fill: ${variables.palette.outline};
  vertical-align: bottom;
  margin-left: ${theme.spacing(0.8)};
`;

export const StyledItemSettingsGroupHeader = styled(StyledFlexTopCenter)`
  cursor: pointer;
  padding-right: ${theme.spacing(1.5)};
  justify-content: space-between;
  width: 100%;
`;

export const StyledItemSettingGroupContainer = styled(Collapse)`
  padding-bottom: ${theme.spacing(2.4)};

  :not(:last-child) {
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.outline_variant};
  }

  .MuiFormLabel-root {
    color: ${variables.palette.on_surface};
  }
`;

export const StyledFormControl = styled(FormControl)`
  width: 100%;
  gap: 1.4rem;
`;

export const StyledFormLabel = styled(FormLabel)`
  cursor: pointer;
  color: ${variables.palette.on_surface};

  &.Mui-focused {
    color: ${variables.palette.on_surface};
  }
`;
