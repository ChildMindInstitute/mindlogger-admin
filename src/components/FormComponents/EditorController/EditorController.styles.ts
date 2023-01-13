import { styled } from '@mui/system';
import MDEditor from '@uiw/react-md-editor';

import theme from 'styles/theme';
import { variables } from 'styles/variables';

export const StyledEditor = styled(MDEditor)`
  &.w-md-editor {
    border-radius: ${variables.borderRadius.lg2};
    border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    background-color: ${variables.palette.surface};
    color: ${variables.palette.on_surface_variant};
    font-size: ${variables.font.size.lg};
    box-shadow: unset;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }

  .w-md-editor-toolbar {
    background-color: ${variables.palette.surface1};
    padding: ${theme.spacing(1)};
    border-radius: ${variables.borderRadius.lg2} ${variables.borderRadius.lg2} 0 0;
    border-bottom: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
    li,
    li + li {
      margin-right: ${theme.spacing(1)};
    }

    button:not([data-name^='comment']) svg path {
      fill: ${variables.palette.on_surface_variant};
    }

    li > button:hover {
      background-color: ${variables.palette.primary_alfa8};
      border-radius: ${variables.borderRadius.xxxl};
    }
  }

  .w-md-editor-content {
    padding: ${theme.spacing(1, 1.6)};
  }
`;
