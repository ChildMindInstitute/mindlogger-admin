export type ConfigurationPopup = {
  open: boolean;
  onClose: () => void;
  onApiTokenSubmitted: (apiTokenExists: boolean) => void;
};
