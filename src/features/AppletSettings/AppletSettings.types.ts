export type AppletSetting = {
  label: string;
  component: JSX.Element;
};

type NavigationSettingItem = {
  icon: JSX.Element;
  label: string;
  component: JSX.Element;
};

export type NavigationSetting = {
  label: string;
  items: NavigationSettingItem[];
};

export type AppletSettingsProps = {
  settings: NavigationSetting[];
};
