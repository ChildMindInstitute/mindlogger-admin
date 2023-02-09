import { Svg } from 'components';

import { StyledButton, StyledContainer } from './Setting.styles';
import { SettingProps } from './Setting.types';

export const Setting = ({ onClose, children }: SettingProps) => (
  <StyledContainer isOpen={!!children}>
    {children}
    {!!children && (
      <StyledButton onClick={onClose}>
        <Svg id="cross" />
      </StyledButton>
    )}
  </StyledContainer>
);
