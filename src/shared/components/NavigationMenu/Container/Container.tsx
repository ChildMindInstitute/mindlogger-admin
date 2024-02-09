import { BuilderContainer } from 'shared/features/BuilderContainer';

import { ActivitySettingsContainerProps } from './Container.types';
import { ContainerHeader } from './ContainerHeader';

export const Container = ({ title, onClose, children }: ActivitySettingsContainerProps) => (
  <BuilderContainer
    title={title}
    headerProps={{ onClose }}
    Header={ContainerHeader}
    sxProps={{
      margin: 0,
      flexGrow: 1,
      height: '100%',
    }}
  >
    {children}
  </BuilderContainer>
);
