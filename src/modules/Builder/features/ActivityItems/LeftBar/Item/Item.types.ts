import { APIItem } from 'modules/Builder/api';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = APIItem & Omit<LeftBarProps, 'items' | 'handleAddItem'>;
