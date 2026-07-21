import { AuditEvent } from 'shared/types/auditEvent';
import { exportTemplate } from 'shared/utils/exportTemplate';

const flattenAuditEvent = (event: AuditEvent): Record<string, string | number | null> =>
  Object.fromEntries(
    Object.entries(event).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : value,
    ]),
  );

export const exportAuditLogsCsv = async (auditEvents: AuditEvent[], fileName: string) => {
  const flattenedEvents = auditEvents.map(flattenAuditEvent);
  await exportTemplate({ data: flattenedEvents, fileName });
};
