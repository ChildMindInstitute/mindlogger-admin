import { styled } from '@mui/material';

import { MarkDownEditor } from 'shared/components/MarkDownEditor';
import { StyledFlexAllCenter, variables } from 'shared/styles';

export const StyledMdEditor = styled(MarkDownEditor)`
  border-radius: ${variables.borderRadius.lg2};
  border: ${variables.borderWidth.md} solid ${variables.palette.surface_variant};
  background-color: ${variables.palette.surface};
  color: ${variables.palette.on_surface_variant};
  font-size: ${variables.font.size.lg};
  box-shadow: unset;
  height: 32rem;

  &.disabled {
    opacity: ${variables.opacity.disabled};
  }

  &.has-error {
    border: ${variables.borderWidth.md} solid ${variables.palette.semantic.error};
    margin-bottom: 0;
  }

  &.secondary {
    background-color: transparent;
    border-color: ${variables.palette.outline_variant};
    .md-editor-toolbar-wrapper {
      background-color: transparent;
      border-bottom-color: ${variables.palette.outline_variant};
    }
  }

  .cm-editor {
    background-color: transparent;
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

export const StyledCenteredIcon = styled(StyledFlexAllCenter)`
  transform: translate(20%, 25%);
`;
