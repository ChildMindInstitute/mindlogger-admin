import { SettingsTypeEnum } from '../Flanker/Flanker.const';

export type InstructionProps = {
  description: string;
  name?: string;
  title?: string;
  type?: SettingsTypeEnum;
};
