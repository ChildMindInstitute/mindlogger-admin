import { AuditEvent } from 'shared/types/auditEvent';
import { exportTemplate } from 'shared/utils/exportTemplate';

export const exportAuditLogsCsv = async (auditEvents: AuditEvent[], fileName: string) => {
  await exportTemplate({ data: auditEvents, fileName });
};
