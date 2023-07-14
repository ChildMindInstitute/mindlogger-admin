import { PublishedApplet } from 'modules/Library/state';

export const getUpdatedStorageData = (
  applets: PublishedApplet[] | null,
  selectedApplet: PublishedApplet,
  id: string,
) =>
  applets?.length
    ? [...applets.filter((applet) => applet.id !== id), selectedApplet]
    : [selectedApplet];
