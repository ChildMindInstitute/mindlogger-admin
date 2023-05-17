import MdEditor from 'md-editor-rt';
import { styled } from '@mui/system';

import { StyledBodyMedium, theme, variables } from 'shared/styles';

export const StyledMdEditor = styled(MdEditor)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  background-color: ${variables.palette.surface};
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.lg};
  box-shadow: unset;
  margin-bottom: ${theme.spacing(2)};
  height: 24rem;

  &.has-error {
    border: ${variables.borderWidth.md} solid ${variables.palette.semantic.error};
    margin-bottom: 0;
  }

  &.secondary {
    background-color: ${variables.palette.surface1};
  }

  & .md-editor-toolbar-wrapper {
    background-color: ${variables.palette.surface1};
    height: auto;

    & .md-editor-toolbar {
      min-width: auto;
      flex-wrap: wrap;

      & .md-editor-toolbar-left {
        flex-wrap: wrap;
      }

      & .md-editor-toolbar-item {
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color: ${variables.palette.primary_alfa8};
          border-radius: ${variables.borderRadius.xxxl};
        }

        & svg {
          fill: ${variables.palette.on_surface_variant};
        }
      }
    }
  }

  & .md-editor-dropdown-overlay {
    margin-top: 0;
  }
`;

export const StyledErrorText = styled(StyledBodyMedium)`
  color: ${variables.palette.semantic.error};
  font-size: ${variables.font.size.md};
  margin: ${theme.spacing(0.3, 0, 2, 1.4)};
`;
