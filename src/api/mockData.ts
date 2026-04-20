import { type AutomationAction } from '@/types';

export const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "notify_slack", label: "Notify Slack Channel", params: ["channel", "message"] },
  { id: "update_hris", label: "Update HRIS Record", params: ["employeeId", "field", "value"] },
  { id: "send_sms", label: "Send SMS", params: ["phone", "message"] },
];
