export type NotificationProps = {
  accountId: string;
  alertId: string;
  label: string;
  title: string;
  message: string;
  timeAgo: string;
  viewed: boolean;
  imageSrc: string | null;
};
