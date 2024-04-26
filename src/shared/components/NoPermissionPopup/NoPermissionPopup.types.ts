export type UseNoPermissionPopupReturn = {
  noAccessVisible: boolean;
  handleSubmit: () => Promise<void>;
  isBuilder: boolean;
};
