import { BuilderContainer } from 'shared/features/BuilderContainer';

import { ContainerHeader } from './ContainerHeader';
import { ActivitySettingsContainerProps } from './Container.types';

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
