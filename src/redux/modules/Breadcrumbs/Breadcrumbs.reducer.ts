import { PayloadAction } from '@reduxjs/toolkit';

import { Breadcrumb } from 'components/Breadcrumbs';

import { BreadcrumbsSchema } from './Breadcrumbs.schema';

export const reducers = {
  setBreadcrumbs: (state: BreadcrumbsSchema, action: PayloadAction<Breadcrumb[]>): void => {
    state.data = action.payload;
  },
};
