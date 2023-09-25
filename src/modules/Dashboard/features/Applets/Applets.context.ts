import { createContext } from 'react';

import { AppletContextType } from './Applets.types';

export const AppletsContext = createContext<AppletContextType | null>(null);
