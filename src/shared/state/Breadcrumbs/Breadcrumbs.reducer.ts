import { PayloadAction } from '@reduxjs/toolkit';

import { Breadcrumb, BreadcrumbsSchema } from './Breadcrumbs.schema';

export const reducers = {
  setBreadcrumbs: (state: BreadcrumbsSchema, action: PayloadAction<Breadcrumb[]>): void => {
    state.data = action.payload;
  },
};
