import { AuditEvent } from 'shared/types/auditEvent';
import { exportTemplate } from 'shared/utils/exportTemplate';

export const exportAuditLogsCsv = async (auditEvents: AuditEvent[], appletName: string) => {
  await exportTemplate({ data: auditEvents, fileName: `${appletName}-audit-logs-export` });
};
