import { styled, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { theme, variables } from 'shared/styles';

export const StyledExportButton = styled(Button)`
  gap: ${theme.spacing(1)};
  color: ${variables.palette.on_surface_variant};
`;

export const StyledSettingsButton = styled(Link)`
  display: flex;
`;
