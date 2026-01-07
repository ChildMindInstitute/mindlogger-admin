import { styled, Dialog, Box } from '@mui/material';

import { variables } from 'shared/styles/variables';

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    display: flex;
    width: 480px;
    padding: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    border-radius: 16px;
    background: ${variables.palette.surface};
  }
`;

export const StyledHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

export const StyledTitle = styled('h2')`
  margin: 0;
  align-self: stretch;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.title};
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 3.2rem;
`;

export const StyledCloseButton = styled('button')`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  width: 48px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const StyledContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch;
`;

export const StyledDescription = styled(Box)`
  align-self: stretch;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.4rem;
  letter-spacing: 0.5px;
`;

export const StyledQRCodeContainer = styled(Box)`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  align-self: stretch;

  min-height: 225px;
`;

export const StyledQRCodePlaceholder = styled(Box)`
  width: 225px;
  height: 225px;
  background: lightgray
    url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjI1IiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjI1IiBoZWlnaHQ9IjIyNSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxODAiIHk9IjE1IiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMTUiIHk9IjE4MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjYwIiB5PSI2MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjkwIiB5PSI2MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjEyMCIgeT0iNjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSIxNTAiIHk9IjYwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iNjAiIHk9IjkwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMTIwIiB5PSI5MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjE1MCIgeT0iOTAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0iYmxhY2siLz48cmVjdCB4PSI2MCIgeT0iMTIwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iOTAiIHk9IjEyMCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjE1MCIgeT0iMTIwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iOTAiIHk9IjE1MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSJibGFjayIvPjxyZWN0IHg9IjEyMCIgeT0iMTUwIiB3aWR0aD0iMTUiIGhlaWdodD0iMTUiIGZpbGw9ImJsYWNrIi8+PHJlY3QgeD0iMTUwIiB5PSIxNTAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0iYmxhY2siLz48L3N2Zz4=')
    50% / cover no-repeat;
  flex-shrink: 0;
`;

export const StyledInputContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$hasError',
})<{ $hasError?: boolean }>`
  display: flex;
  width: 300px;
  height: 56px;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: ${({ $hasError }) => ($hasError ? '7px 15px' : '8px 16px')};
  border-radius: 4px;
  border: ${({ $hasError }) =>
    $hasError ? `2px solid ${variables.palette.error}` : `1px solid ${variables.palette.outline}`};

  &:focus-within {
    border: 2px solid
      ${({ $hasError }) => ($hasError ? variables.palette.error : variables.palette.primary)};
    padding: 7px 15px;
  }
`;

export const StyledInput = styled('input')`
  width: 100%;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${variables.palette.on_surface};
  font-family: ${variables.font.family.input};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.15px;

  &::placeholder {
    color: ${variables.palette.outline};
    opacity: 0.38;
  }

  &:focus {
    outline: none;
  }
`;

export const StyledButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

export const StyledButton = styled('button')`
  display: flex;
  width: 300px;
  height: 48px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 100px;
  border: none;
  background: ${variables.palette.primary};
  color: ${variables.palette.on_primary};
  text-align: center;
  font-family: ${variables.font.family.label};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2.4rem;
  letter-spacing: 0.15px;
  cursor: pointer;
  padding: 10px 24px;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  &.secondary {
    background: transparent;
    border: none;
    height: auto;
    padding: 0;
    color: ${variables.palette.primary};
    font-family: ${variables.font.family.label};
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.4rem;
    letter-spacing: 0.15px;
    text-align: center;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledLink = styled(Box)`
  color: ${variables.palette.primary};
  text-align: center;
  font-family: ${variables.font.family.label};
  font-size: 1.6rem;
  font-style: normal;
  font-weight: ${variables.font.weight.regular};
  line-height: 2.4rem;
  letter-spacing: 0.15px;
  cursor: pointer;
  align-self: stretch;

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledErrorMessage = styled(Box)`
  margin-top: 4px;
  padding-left: 16px;
  color: ${variables.palette.error};
  font-family: ${variables.font.family.body};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: 0.25px;
  text-align: left;
  animation: fadeIn 0.2s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const StyledLoadingContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${variables.palette.white_alpha50};
  border-radius: 8px;
`;
