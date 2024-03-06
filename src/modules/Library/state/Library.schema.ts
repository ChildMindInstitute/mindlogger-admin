import { BaseSchema, ActivityFlow, Activity } from 'redux/modules';

export type PublishedActivity = Omit<
  Activity,
  'id' | 'key' | 'order' | 'isPerformanceTask' | 'performanceTaskType' | 'createdAt'
> & {
  key: string;
};
export type PublishedActivityFlow = Omit<
  ActivityFlow,
  'id' | 'key' | 'order' | 'activityIds' | 'createdAt' | 'items'
> & {
  items: { activityKey: string }[];
};

export type PublishedApplet = {
  about?: Record<string, string> | null;
  activities: PublishedActivity[];
  activityFlows: PublishedActivityFlow[];
  description?: Record<string, string> | null;
  displayName: string;
  id: string;
  image?: string;
  keywords: string[];
  themeId?: string | null;
  version?: string;
  watermark?: string;
};

export type SelectedCartApplet = Omit<PublishedApplet, 'keywords' | 'version' | 'id'>;
export type SelectedCombinedCartApplet = Omit<
  SelectedCartApplet,
  'about' | 'description' | 'displayName' | 'image' | 'watermark'
>;

export type PublishedApplets = {
  result: PublishedApplet[];
  count: number;
};

export type CartApplets = {
  result: PublishedApplet[];
  count: number;
};

export type LibrarySchema = {
  publishedApplets: BaseSchema<PublishedApplets>;
  cartApplets: BaseSchema<CartApplets>;
  isAddToBuilderBtnDisabled: BaseSchema<boolean>;
};
