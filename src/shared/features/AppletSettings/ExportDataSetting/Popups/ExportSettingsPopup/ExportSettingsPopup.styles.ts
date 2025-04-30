import { styled } from '@mui/material';

import { variables } from 'shared/styles';
import { StyledAppletSettingsDescription } from 'shared/features/AppletSettings/AppletSettings.styles';

export const StyledExportSettingsDescription = styled(StyledAppletSettingsDescription)`
  font-weight: ${variables.font.weight.bold};
  margin-bottom: 0;
`;

export const StyledExportSettingsForm = styled('form')`
  // Give every child (except the first) a top margin:
  & > * + * {
    margin-top: 24px;
  }

  // Any child with this class will not have a top margin:
  & > .no-gap {
    margin-top: 0;
  }
`;
