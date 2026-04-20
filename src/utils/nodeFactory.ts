import { NodeType, type AnyNodeData } from '@/types';

export const createDefaultNodeData = (type: NodeType, id: string): AnyNodeData => {
  const baseData = {
    id,
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    configured: false,
  };

  switch (type) {
    case NodeType.Start:
      return {
        ...baseData,
        title: 'Start Workflow',
        metadata: [],
      };
    case NodeType.Task:
      return {
        ...baseData,
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case NodeType.Approval:
      return {
        ...baseData,
        title: 'Pending Approval',
        approverRole: '',
        autoApproveThreshold: 0,
      };
    case NodeType.Automation:
      return {
        ...baseData,
        title: 'Run Automation',
        actionId: '',
        actionParams: {},
      };
    case NodeType.End:
      return {
        ...baseData,
        title: 'Workflow End',
        endMessage: 'Workflow Completed',
        summaryEnabled: false,
      };
    case NodeType.Project:
      return {
        ...baseData,
        name: 'New Project',
        platform: 'Jira',
        typeLabel: 'Epic',
        issueCount: 0,
        progress: 0,
      };
    case NodeType.MetricInput:
    case NodeType.NorthStar:
    case NodeType.KPI:
      return {
        ...baseData,
        name: 'New Metric',
        aggregation: 'Sum',
        periods: [],
      };
    default:
      throw new Error(`Unsupported node type: ${type}`);
  }
};
