export type LegendEvent = {
  name: string;
  id: string;
  isFlow: boolean;
  count?: number;
  colors?: string[];
};

export type PreparedEvents = {
  alwaysAvailableEvents: LegendEvent[];
  scheduledEvents: LegendEvent[];
  deactivatedEvents: LegendEvent[];
};
