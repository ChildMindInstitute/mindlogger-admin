import { Svg } from 'shared/components/Svg';
import { StyledBuilderContainerHeader } from 'shared/features';
import { StyledClearedButton, StyledFlexTopCenter, theme } from 'shared/styles';

import { ConfigurationHeaderProps } from './ConfigurationHeader.types';

export const ConfigurationHeader = ({ isSticky, children, headerProps }: ConfigurationHeaderProps) => {
  const { responseType, optionalItemsRef, onClose } = headerProps ?? {};

  return (
    <StyledBuilderContainerHeader isSticky={isSticky}>
      {children}
      <StyledFlexTopCenter>
        {responseType && (
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={() => optionalItemsRef?.current?.setSettingsDrawerVisible(true)}
            data-testid="builder-activity-items-item-configuration-settings"
          >
            <Svg id="configure" />
          </StyledClearedButton>
        )}
        <StyledClearedButton
          sx={{ p: theme.spacing(1) }}
          onClick={onClose}
          data-testid="builder-activity-items-item-configuration-close"
        >
          <Svg id="close" />
        </StyledClearedButton>
      </StyledFlexTopCenter>
    </StyledBuilderContainerHeader>
  );
};
