export enum AvatarUiType {
  Primary,
  Secondary,
}

export type AvatarProps = {
  caption: string;
  uiType?: AvatarUiType;
};
