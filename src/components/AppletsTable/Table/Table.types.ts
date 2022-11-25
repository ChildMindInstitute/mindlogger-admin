import { HeadCell } from 'types/table';

export type Row = {
  // main properties for folder and applet
  depth?: number;
  id?: string;
  isExpanded?: boolean;
  isRenaming?: boolean;
  isFolder?: boolean;
  isNew?: boolean;
  isVisible?: boolean;
  items?: Row[];
  name?: string;
  // applet properties
  description?: string;
  displayName?: string;
  editing?: boolean;
  encryption?: {
    appletPrime: number[];
    appletPublicKey: number[];
    base: number[];
  };
  hasUrl?: boolean;
  image?: string;
  largeApplet?: boolean;
  published?: boolean;
  roles?: string[];
  themeId?: string;
  updated?: string;
  welcomeApplet?: boolean;
};

export type TableProps = {
  columns: HeadCell[];
  rows: Row[] | undefined;
  orderBy: string;
  headerContent: JSX.Element;
};
