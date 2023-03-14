import { lazy } from 'react';

import { page } from 'resources';

const AppletsCatalog = lazy(() => import('modules/Library/features/AppletsCatalog'));
const AppletDetails = lazy(() => import('modules/Library/features/AppletDetails'));
const Cart = lazy(() => import('modules/Library/features/Cart'));

export const routes = [
  { path: page.library, Component: AppletsCatalog },
  { path: page.libraryAppletDetails, Component: AppletDetails },
  { path: page.libraryCart, Component: Cart },
];
