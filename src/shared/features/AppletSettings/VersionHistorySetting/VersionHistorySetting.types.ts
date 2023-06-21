export type VersionChanges = {
  displayName: string;
  changes: string[];
  activities: {
    changes: string[];
    items: { name: string; changes: string[] | null }[];
    name: string;
  }[];
};
