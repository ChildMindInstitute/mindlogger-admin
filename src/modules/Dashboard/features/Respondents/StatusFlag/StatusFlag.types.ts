export enum StatusType {
  NotInvited,
  Pending,
}

export type StatusFlagProps = {
  status: StatusType;
  onInviteClick?: () => void;
};
