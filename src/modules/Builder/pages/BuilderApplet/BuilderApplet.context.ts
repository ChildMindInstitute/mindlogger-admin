import { createContext, MutableRefObject } from 'react';

import { BuilderSave } from './BuilderApplet.types';

// Lets builder tabs reuse the Save & Publish flow
export const BuilderSaveContext = createContext<MutableRefObject<BuilderSave | null> | null>(null);
